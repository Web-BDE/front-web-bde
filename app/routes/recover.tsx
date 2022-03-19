import { Container, Typography } from "@mui/material";
import { generateAlert } from "~/utils/error";
import RecoverForm from "~/components/recoverForm";
import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useSearchParams,
} from "remix";
import { recoverPassword } from "~/services/authentication";
import ChangePasswordForm from "~/components/changePasswordForm";
import { updateSelf, updateUser } from "~/services/user";

type ActionData = {
  recoverResponse: {
    error?: string;
    success?: string;
    fields?: { email: string };
    fieldsError?: { email?: string };
  };
  changePasswordResponse: {
    error?: string;
    success?: string;
    fields?: { password: string };
    fieldsError?: { password?: string };
  };
};

async function handleReover(email: string) {
  const { code, ...recoverResponse } = await recoverPassword(email);

  return json({ recoverResponse } as ActionData, code);
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

async function handleChangePassword(
  password: string,
  confirm: string,
  token: string
) {
  const fields = {
    password,
  };
  const fieldsError = {
    password: validatePasswordAndConfirm(password, confirm),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json(
      { changePasswordResponse: { fields, fieldsError } } as ActionData,
      400
    );
  }

  const { code, ...changePasswordResponse } = await updateSelf(
    undefined,
    fields,
    token
  );

  return redirect("/login");
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  switch (request.method) {
    case "POST":
      const email = form.get("email");

      if (typeof email !== "string") {
        return json(
          {
            recoverResponse: {
              error:
                "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
            },
          } as ActionData,
          400
        );
      }

      return handleReover(email);
    case "PATCH":
      const password = form.get("password");
      const confirm = form.get("confirm");

      if (typeof password !== "string" || typeof confirm !== "string") {
        return json(
          {
            recoverResponse: {
              error:
                "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
            },
          } as ActionData,
          400
        );
      }

      const recoverToken = new URL(request.url).searchParams.get("token");

      if (!recoverToken) {
        return json(
          {
            changePasswordResponse: { error: "Invalid token query" },
          } as ActionData,
          404
        );
      }

      return handleChangePassword(password, confirm, recoverToken);
    default:
      throw json("Mauvais méthode dans la requête", 404);
  }
};

function displayForms(searchParams: URLSearchParams, actionData?: ActionData) {
  const token = searchParams.get("token");
  if (token) {
    return (
      <div>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        {generateAlert("error", actionData?.changePasswordResponse?.error)}
        {generateAlert("success", actionData?.changePasswordResponse?.success)}
        <ChangePasswordForm
          formData={actionData?.changePasswordResponse}
          redirectTo={searchParams.get("redirectTo")}
          token={token}
        />
      </div>
    );
  } else {
    return (
      <div>
        <Typography component="h1" variant="h5">
          Recover Password
        </Typography>
        {generateAlert("error", actionData?.recoverResponse?.error)}
        {generateAlert("success", actionData?.recoverResponse?.success)}
        <RecoverForm
          formData={actionData?.recoverResponse}
          redirectTo={searchParams.get("redirectTo")}
        />
      </div>
    );
  }
}

export default function Recover() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <Container style={{ marginTop: "100px", marginBottom: "100px" }}>
      <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
        {displayForms(searchParams, actionData)}
      </Container>
    </Container >
  );
}
