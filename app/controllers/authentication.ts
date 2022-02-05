import { json } from "remix";
import { loginUser } from "~/services/authentication";
import { registerUser } from "~/services/user";
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

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password is too small";
  }
}

export async function handleLogin(
  email: string,
  password: string,
  redirectTo: string
) {
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
}

export async function handleRegister(
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

  return await loginUser(
    {
      email: fields.email,
      password: fields.password,
    },
    redirectTo
  );
}
