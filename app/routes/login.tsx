import {
  ActionFunction,
  json,
  Link,
  LinksFunction,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

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

function badRequest(data: ActionData) {
  return json(data, 400);
}

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
    return badRequest({ formError: "You must fill all the form" });
  }

  const fields = { email, password };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return badRequest({ fields, fieldsError });
  }

  let loginRedirection;
  try {
    loginRedirection = await loginUser(fields, redirectTo);
  } catch (err) {
    if (err instanceof APIError) {
      return badRequest({ formError: err.error.message, fields });
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
        <p>{actionData?.formError}</p>
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
          <p>{actionData?.fieldsError?.email}</p>
        </div>
        <div>
          <div>
            <label htmlFor="password-input">Password</label>
          </div>
          <input type="password" name="password" id="password-input" />
          <p>{actionData?.fieldsError?.password}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 401:
      return (
        <div className="container">
          <p>
            You must be <Link to="/login">logged in</Link> to see this data
          </p>
        </div>
      );
    case 403:
      return (
        <div className="container">
          <p>Sorry, you don't have the rights to see this</p>
        </div>
      );
    default:
      <div className="container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <p>{caught.data}</p>
      </div>;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
