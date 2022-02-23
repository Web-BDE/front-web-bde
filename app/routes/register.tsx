import {
  ActionFunction,
  json,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

import RegisterForm, { RegisterFormData } from "~/components/registerForm";

import { Container } from "@mui/material";

import { registerUser } from "~/services/user";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";
import { handleLogin } from "./login";

type ActionData = {
  registerUser: RegisterFormData;
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
    email,
    password,
    pseudo,
    name: name ? name : undefined,
    surname: surname ? surname : undefined,
  };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePasswordAndConfirm(password, confirm),
    confirm: validatePasswordAndConfirm(password, confirm),
    pseudo: validatePseudo(pseudo),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ registerUser: { fields, fieldsError } } as ActionData, 400);
  }

  const { code, ...registerResult } = await registerUser(fields);

  if (registerResult.error) {
    return json({ registerUser: { registerResult } } as ActionData, code);
  }

  return await handleLogin(fields.email, fields.password, redirectTo);
}

//Function that handle POST requests
export const action: ActionFunction = async ({ request }) => {
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
        registerUser: { formError: "There was an error, please try again" },
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
          formError:
            "Invalid data provided, please check if you have fill all the requierd fields",
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
};

export default function Register() {
  const actionData = useActionData<RegisterFormData>();
  const [searchparams] = useSearchParams();
  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <RegisterForm
        formData={actionData}
        redirectTo={searchparams.get("redirectTo")}
      />
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
