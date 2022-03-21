import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

import RegisterForm from "~/components/registerForm";

import { Container, Typography } from "@mui/material";

import { registerUser } from "~/services/user";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";
import { RegisterFormData } from "~/models/User";
import { loginUser } from "~/services/authentication";

type ActionData = {
  registerUser?: {
    formData?: RegisterFormData;
    error?: string;
    success?: string;
  };
};

//Validator for email field
function validateEmail(email: string) {
  if (
    !new RegExp(
      process.env["EMAIL_REGEX"] || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ).test(email)
  ) {
    return "User email must match your student email domain";
  }
}

//Validator for password field
function validatePasswordAndConfirm(password: string, confirm: string) {
  if (password !== confirm) {
    return "Passwords need to match";
  }
  if (password.length < 8) {
    return "Password is too small";
  }
}

//Validator for pseudo field
function validatePseudo(pseudo: string) {
  if (pseudo.length < 3) {
    return "Pseudo is too small";
  }
}

async function handleLogin(
  email: string,
  password: string,
  redirectTo: string
) {
  const fields = { email: email.trim().toLocaleLowerCase() };

  const { code, ...loginResult } = await loginUser({ ...fields, password });

  if (loginResult.error || !loginResult.cookie) {
    return redirect("/login", code || 500);
  }

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": loginResult.cookie,
    },
  });
}

async function handleRegister(
  email: string,
  password: string,
  confirm: string,
  pseudo: string,
  redirectTo: string,
  name?: string,
  surname?: string
) {
  const fields = {
    email: email.trim().toLocaleLowerCase(),
    pseudo,
    name,
    surname,
  };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePasswordAndConfirm(password, confirm),
    confirm: validatePasswordAndConfirm(password, confirm),
    pseudo: validatePseudo(pseudo),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json(
      { registerUser: { formData: { fields, fieldsError } } } as ActionData,
      400
    );
  }

  const { code, ...registerResult } = await registerUser({
    ...fields,
    password,
  });

  if (registerResult.error) {
    return json(
      {
        registerUser: { ...registerResult, formData: { fields, fieldsError } },
      } as ActionData,
      code
    );
  }

  return await handleLogin(email, password, redirectTo);
}

//Function that handle POST requests
export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "PUT":
      //Intitialize all fields
      const form = await request.formData();
      const redirectTo = form.get("redirectTo");
      //Register data
      const email = form.get("email");
      const password = form.get("password");
      const confirm = form.get("confirm-password");
      const pseudo = form.get("pseudo");
      const name = form.get("name");
      const surname = form.get("surname");

      //Check if redirection is here, should always be
      if (typeof redirectTo !== "string") {
        return json(
          {
            registerUser: { error: "Il y a eu une erreur, veuillez réessayer" },
          } as ActionData,
          500
        );
      }

      //Check for fields type
      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof confirm !== "string" ||
        typeof pseudo !== "string" ||
        (typeof name !== "string" && name !== null) ||
        (typeof surname !== "string" && surname !== null)
      ) {
        return json(
          {
            registerUser: {
              error:
                "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
            },
          } as ActionData,
          400
        );
      }

      return await handleRegister(
        email,
        password,
        confirm,
        pseudo,
        redirectTo,
        name ? name : undefined,
        surname ? surname : undefined
      );

    default:
      throw json("Mauvais méthode dans la requête", 404);
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <Container style={{ marginTop: "100px", marginBottom: "100px" }}>
      <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        {generateAlert("error", actionData?.registerUser?.error)}
        {generateAlert("success", actionData?.registerUser?.success)}
        <RegisterForm
          formData={actionData?.registerUser?.formData}
          redirectTo={searchparams.get("redirectTo")}
        />
      </Container>
    </Container>
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
