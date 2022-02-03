import {
  ActionFunction,
  json,
  Link,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";

import { loginUser } from "~/services/authentication";
import { registerUser } from "~/services/user";
import { APIError } from "~/utils/axios";

type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string;
    pseudo?: string;
  };
  fields?: {
    email: string;
    pseudo: string;
    name?: string;
    surname?: string;
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

function validatePassword(password: string, confirm: string) {
  if (password !== confirm) {
    return "Passwords need to match";
  }
  if (password.length < 8) {
    return "Password is too small";
  }
}

function validatePseudo(pseudo: string) {
  if (pseudo.length < 3) {
    return "Pseudo is too small";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const confirm = form.get("confirm-password");
  const pseudo = form.get("pseudo");
  const name = form.get("name");
  const surname = form.get("surname");
  const redirectTo = form.get("redirectTo");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirm !== "string" ||
    typeof redirectTo !== "string" ||
    typeof pseudo !== "string" ||
    (typeof name !== "string" && name !== null) ||
    (typeof surname !== "string" && surname !== null)
  ) {
    return badRequest({ formError: "You must fill the required fields" });
  }

  const fields = {
    email,
    password,
    pseudo,
    name: name ? name : undefined,
    surname: surname ? surname : undefined,
  };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePassword(password, confirm),
    pseudo: validatePseudo(pseudo),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return badRequest({ fields, fieldsError });
  }

  try {
    await registerUser(fields);
  } catch (err) {
    if (err instanceof APIError) {
      return badRequest({ formError: err.error.message, fields });
    }
    throw err;
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

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <div className="container">
      <h2>Register</h2>
      <form method="post">
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
        <div>
          <div>
            <label htmlFor="confirm-password-input">Confirm Password</label>
          </div>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password-input"
          />
          <span>{actionData?.fieldsError?.password}</span>
        </div>
        <div>
          <div>
            <label htmlFor="pseudo-input">pseudo</label>
          </div>
          <input
            type="pseudo"
            name="pseudo"
            id="pseudo-input"
            defaultValue={actionData?.fields?.pseudo}
          />
          <span>{actionData?.fieldsError?.pseudo}</span>
        </div>
        <div>
          <div>
            <label htmlFor="name-input">name*</label>
          </div>
          <input
            type="name"
            name="name"
            id="name-input"
            defaultValue={actionData?.fields?.name}
          />
          <p></p>
        </div>
        <div>
          <div>
            <label htmlFor="surname-input">surname*</label>
          </div>
          <input
            type="surname"
            name="surname"
            id="surname-input"
            defaultValue={actionData?.fields?.surname}
          />
          <p></p>
        </div>
        <p>* Optional</p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return generateUnexpectedError(error);
}
