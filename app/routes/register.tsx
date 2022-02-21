import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

import RegisterForm, { RegisterFormData } from "~/components/registerForm";

import { Container } from "@mui/material";

import { registerUser } from "~/services/user";
import { loginUser } from "~/services/authentication";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";
import { APIError } from "~/utils/axios";

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
    return json({ fields, fieldsError }, 400);
  }

  try {
    await registerUser(fields);
  } catch (err) {
    if (err instanceof APIError) {
      return json({ formError: err.error.message, fields }, err.code);
    }
    throw err;
  }

  try {
    return await loginUser(
      { email: fields.email, password: fields.password },
      redirectTo
    );
  } catch (err) {
    if (err instanceof APIError) {
      return redirect(
        "/login",
        json(
          { formError: err.error.message, fields: { email: fields.email } },
          err.code
        )
      );
    }
    throw err;
  }
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
    return json({ formError: "There was an error, please try again" }, 500);
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
        formError:
          "Invalid data provided, please check if you have fill all the requierd fields",
      },
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
      ></RegisterForm>
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
