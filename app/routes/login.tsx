import {
  ActionFunction,
  json,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

//Controllers
import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import LoginForm, { LoginFormData } from "~/components/loginForm";
import { Container } from "@mui/material";
import { loginUser } from "~/services/authentication";
import { APIError } from "~/utils/axios";

async function handleLogin(
  email: string,
  password: string,
  redirectTo: string
) {
  const fields = { email, password };

  try {
    return await loginUser(fields, redirectTo);
  } catch (err) {
    if (err instanceof APIError) {
      return json({ formError: err.error.message, fields }, err.code);
    }
    throw err;
  }
}

//Function that handle POST requests
export const action: ActionFunction = async ({ request }) => {
  //Initialise form
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");
  //Initialise data
  const email = form.get("email");
  const password = form.get("password");

  //Should never happend, check if redirectTo is present
  if (typeof redirectTo !== "string") {
    return json({ formError: "Something went wrong, please try again" }, 500);
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return json(
      {
        formError:
          "Invalid data provided, please check if you have fill all the requierd fields",
      },
      400
    );
  }

  return await handleLogin(email, password, redirectTo);
};

export default function Login() {
  const actionData = useActionData<LoginFormData>();
  const [searchparams] = useSearchParams();

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <LoginForm
        formData={actionData}
        redirectTo={searchparams.get("redirectTo")}
      ></LoginForm>
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
