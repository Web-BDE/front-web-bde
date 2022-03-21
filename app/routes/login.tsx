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

async function handleLogin(
  email: string,
  password: string,
  redirectTo: string
) {
  const fields = { email: email.trim().toLowerCase() };

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
            loginUser: {
              error: "Quelque chose s'est mal passé, veuillez réessayer",
            },
          } as ActionData,
          500
        );
      }

      if (typeof email !== "string" || typeof password !== "string") {
        return json(
          {
            loginUser: {
              error:
                "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
            },
          } as ActionData,
          400
        );
      }

      return await handleLogin(email, password, redirectTo);

    default:
      throw json("Mauvais méthode dans la requête", 404);
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();

  return (
    <Container style={{ marginTop: "100px", marginBottom: "100px" }}>
      <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
        <Typography component="h1" variant="h5">
          Connection
        </Typography>
        {generateAlert("error", actionData?.loginUser?.error)}
        {generateAlert("success", actionData?.loginUser?.success)}
        <LoginForm
          formData={actionData?.loginUser?.formData}
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
