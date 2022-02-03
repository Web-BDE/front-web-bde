import {
  ActionFunction,
  json,
  Link,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";

import { loginUser } from "~/services/authentication";
import { APIError } from "~/utils/axios";

type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
  };
};

function validateEmail(email: string) {
  if (
    !new RegExp(
      process.env["EMAIL_REGEX"] || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ).test(email)
  ) {
    return "User email must match your student email domain";
  }
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password is too small";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ formError: "You must fill all the form" }, 400);
  }

  const fields = { email, password };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ fields, fieldsError }, 400);
  }

  let loginRedirection;
  try {
    loginRedirection = await loginUser(fields, redirectTo);
  } catch (err) {
    if (err instanceof APIError) {
      return json({ formError: err.error.message, fields }, err.code);
    }
    throw err;
  }

  return loginRedirection;
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <div className="container">
      <h2>Login</h2>
      <form method="post" className="login-form">
        <span>{actionData?.formError}</span>
        <input
          type="hidden"
          name="redirectTo"
          value={searchparams.get("redirectTo") || "/"}
        />
        <div>
          <div>
            <label htmlFor="email-input">Email</label>
          </div>
          <input
            type="text"
            name="email"
            id="email-input"
            defaultValue={actionData?.fields?.email}
          />
          <span>{actionData?.fieldsError?.email}</span>
        </div>
        <div>
          <div>
            <label htmlFor="password-input">Password</label>
          </div>
          <input type="password" name="password" id="password-input" />
          <span>{actionData?.fieldsError?.password}</span>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  generateUnexpectedError(error);
}
