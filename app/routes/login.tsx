import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import { createUserSession, loginUser } from "~/utils/authentication";

type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password: string;
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

  const session = await loginUser(fields);

  if (session instanceof Error) {
    return badRequest({ fields, formError: session.message });
  }

  return createUserSession(session.token, session.userId, redirectTo);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <div>
      <h1>Login</h1>
      <form method="post">
        <p>{actionData?.formError}</p>
        <input
          type="hidden"
          name="redirectTo"
          value={searchparams.get("redirectTo") || "/"}
        />
        <div>
          <label htmlFor="email-input">Email</label>
          <input
            type="text"
            name="email"
            id="email-input"
            defaultValue={actionData?.fields?.email}
          />
          <p>{actionData?.fieldsError?.email}</p>
        </div>
        <div>
          <label htmlFor="password-input">Password</label>
          <input
            type="password"
            name="password"
            id="password-input"
            defaultValue={actionData?.fields?.password}
          />
          <p>{actionData?.fieldsError?.password}</p>
        </div>
        <button type="submit">Submiut</button>
      </form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
    </div>
  );
}
