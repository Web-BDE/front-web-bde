import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

//Controllers
import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import LoginForm from "~/components/loginForm";
import { Container, Typography } from "@mui/material";
import { loginUser } from "~/services/authentication";
import { LoginFormData } from "~/models/User";

type ActionData = {
  loginUser?: { formData?: LoginFormData; error?: string; success?: string };
};

export async function handleLogin(
  email: string,
  password: string,
  redirectTo: string
) {
  const fields = { email };

  const { code, ...loginResult } = await loginUser({ ...fields, password });

  if (loginResult.error || !loginResult.cookie) {
    return json(
      {
        loginUser: {
          error: loginResult.error || "Cloud not find logout cookies",
        },
      } as ActionData,
      code || 500
    );
  }

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": loginResult.cookie,
    },
  });
}

//Function that handle POST requests
export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST":
      //Initialise form
      const form = await request.formData();
      const redirectTo = form.get("redirectTo");
      //Initialise data
      const email = form.get("email");
      const password = form.get("password");

      //Should never happend, check if redirectTo is present
      if (typeof redirectTo !== "string") {
        return json(
          {
            loginUser: { error: "Something went wrong, please try again" },
          } as ActionData,
          500
        );
      }

      if (typeof email !== "string" || typeof password !== "string") {
        return json(
          {
            loginUser: {
              error:
                "Invalid data provided, please check if you have fill all the requierd fields",
            },
          } as ActionData,
          400
        );
      }

      return await handleLogin(email, password, redirectTo);

    default:
      throw new Error("Bad request method");
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <Typography component="h1" variant="h5">
        Log in
      </Typography>
      {generateAlert("error", actionData?.loginUser?.error)}
      {generateAlert("success", actionData?.loginUser?.success)}
      <LoginForm
        formData={actionData?.loginUser?.formData}
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
