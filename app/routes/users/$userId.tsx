import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  useActionData,
  useCatch,
  useLoaderData,
  useOutletContext,
} from "remix";

import UserDisplay from "~/components/user/userDisplay";

import UpdateUserForm from "~/components/user/updateUserForm";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { requireAuth } from "~/services/authentication";
import { deleteUser, getUser, updateUser } from "~/services/user";
import {
  createPurchase,
  deletePurchase,
  getManyPurchase,
  UpdatePurchase,
} from "~/services/purchase";

import { Container, Typography } from "@mui/material";
import { ContextData } from "~/root";
import { getSelft } from "~/services/user";
import { UpdateUserFormData, User } from "~/models/User";

type LoaderData = {
  userResponse?: {
    error?: string;
    success?: string;
    user?: User;
  };
};

type ActionData = {
  updateUserResponse?: {
    formData?: UpdateUserFormData;
    success?: string;
    error?: string;
  };
};

async function loadUser(token: string, userId: number) {
  const { code, ...userResponse } = await getUser(token, userId);

  return json(
    {
      userResponse: {
        ...userResponse,
      },
    } as LoaderData,
    code
  );
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.userId) {
    throw json("Invalid user query", 404);
  }

  const token = await requireAuth(request, `/user/${params.userId}`);

  return await loadUser(token, parseInt(params.userId));
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

//Validator for pseudo field
function validatePseudo(pseudo: string) {
  if (pseudo.length < 3) {
    return "Pseudo is too small";
  }
}

async function handleUpdateUser(
  token: string,
  pseudo: string,
  name: string | null,
  surname: string | null,
  wallet: number,
  privilege: number,
  userId: number
) {
  const fields = {
    pseudo,
    name,
    surname,
    wallet,
    privilege,
  };
  const fieldsError = {
    pseudo: validatePseudo(pseudo),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json(
      { updateUserResponse: { fields, fieldsError } } as ActionData,
      400
    );
  }

  const { code, ...updateUserResponse } = await updateUser(
    token,
    fields,
    userId
  );

  return json(
    {
      updateUserResponse,
    } as ActionData,
    code
  );
}

async function handleDeleteUser(token: string, userId: number) {
  const { code, ...deleteUserResponse } = await deleteUser(token, userId);

  if (deleteUserResponse.error) {
    return json({ deleteUserResponse } as ActionData, code);
  }

  return redirect("/user");
}

async function handleRefundUser(token: string, purchaseId: number) {
  const { code, ...refundUserResponse } = await deletePurchase(
    token,
    purchaseId
  );

  return json({ refundUserResponse } as ActionData, code);
}

async function handleDeliverUser(
  token: string,
  delivered: boolean,
  purchaseId: number
) {
  const { code, ...deliverUserResponse } = await UpdatePurchase(
    token,
    purchaseId,
    delivered
  );

  return json({ deliverUserResponse } as ActionData, code);
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.userId) {
    return json(
      {
        updateUserResponse: { error: "Invalid user query" },
      } as ActionData,
      404
    );
  }

  const token = await requireAuth(request, `/user/${params.challengeId}`);

  const form = await request.formData();
  const pseudo = form.get("pseudo");
  const name = form.get("name");
  const surname = form.get("surname");
  const wallet = form.get("wallet");
  const privilege = form.get("privilege");

  if (
    typeof pseudo !== "string" ||
    (typeof name !== "string" && name !== null) ||
    (typeof surname !== "string" && surname !== null) ||
    typeof wallet !== "string" ||
    typeof privilege !== "string"
  ) {
    return json(
      {
        updateUserResponse: {
          error:
            "Invalid data provided, please check if you have fill all the requierd fields",
        },
      } as ActionData,
      400
    );
  }

  return await handleUpdateUser(
    token,
    pseudo,
    name,
    surname,
    parseInt(wallet),
    parseInt(privilege),
    parseInt(params.userId)
  );
};

// For the creator of the user, replace displays by inputs
function displayUser(
  user: User,
  formData?: UpdateUserFormData,
  userId?: number,
  userPrivilege?: number
) {
  if (user.id === userId || (userPrivilege && userPrivilege >= 2)) {
    return (
      <div>
        <UpdateUserForm user={user} formData={formData} />
      </div>
    );
  } else {
    return (
      <div>
        <UserDisplay user={user} />
      </div>
    );
  }
}

export default function User() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const { userInfo } = useOutletContext<ContextData>();

  return (
    <Container style={{ marginTop: "50px" }} component="main">
      <Container maxWidth="xs">
        <Typography variant="h4">User</Typography>
        {generateAlert("error", loaderData.userResponse?.error)}
        {generateAlert("error", actionData?.updateUserResponse?.error)}
        {generateAlert("success", actionData?.updateUserResponse?.success)}
        {loaderData.userResponse?.user && (
          <div>
            {displayUser(
              loaderData.userResponse?.user,
              actionData?.updateUserResponse?.formData,
              userInfo?.id,
              userInfo?.privilege
            )}
          </div>
        )}
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
