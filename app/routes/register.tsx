import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import {
  createUserSession,
  loginUser,
  registerUser,
} from "~/services/authentication";

type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string;
    pseudo?: string;
  };
  fields?: {
    email: string;
    password: string;
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

function validatePassword(password: string) {
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
  const pseudo = form.get("pseudo");
  const name = form.get("name");
  const surname = form.get("surname");
  const redirectTo = form.get("redirectTo");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
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
    password: validatePassword(password),
    pseudo: validatePseudo(pseudo),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return badRequest({ fields, fieldsError });
  }

  const user = await registerUser(fields);

  if (!user) {
    return badRequest({
      fields,
      formError: "Something went wrong when creating user",
    });
  }

  const session = await loginUser(fields);

  if (session instanceof Error) {
    return badRequest({
      fields,
      formError: "Something went wrong when loging user",
    });
  }

  return createUserSession(session.token, session.userId, redirectTo);
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <div>
      <h1>Register</h1>
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
        <div>
          <label htmlFor="pseudo-input">pseudo</label>
          <input
            type="pseudo"
            name="pseudo"
            id="pseudo-input"
            defaultValue={actionData?.fields?.pseudo}
          />
          <p>{actionData?.fieldsError?.pseudo}</p>
        </div>
        <div>
          <label htmlFor="name-input">name*</label>
          <input
            type="name"
            name="name"
            id="name-input"
            defaultValue={actionData?.fields?.name}
          />
          <p></p>
        </div>
        <div>
          <label htmlFor="surname-input">surname*</label>
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
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
      <p>{caught.data}</p>
    </div>
  );
}
