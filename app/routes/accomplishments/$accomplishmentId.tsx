import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  useActionData,
  useCatch,
  useLoaderData,
  useOutletContext,
  useTransition,
} from "remix";

import {
  createAccomplishment,
  getManyAccomplishment,
  putProof,
  updateAccomplishment,
} from "~/services/accomplishment";
import { requireAuth } from "~/services/authentication";
import {
  deleteAccomplishment,
  getAccomplishment,
} from "~/services/accomplishment";

import {
  generateUnexpectedError,
  generateExpectedError,
  generateAlert,
} from "../../utils/error";

import { CircularProgress, Container, Typography } from "@mui/material";
import { useContext } from "react";
import {
  Accomplishment,
  CreateAccomplishmentFormData,
  DeleteAccomplishmentFormData,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";
import { ContextData } from "~/root";
import { getSelft, getUser } from "~/services/user";
import { User } from "~/models/User";
import UpdateAccomplishmentForm from "~/components/challenge/forms/updateAccomplishmentForm";
import DeleteAccomplishmentForm from "~/components/challenge/forms/deleteAccomplishmentForm";
import AccomplishmentDisplay from "~/components/challenge/accomplishmentDisplay";
import { blue } from "@mui/material/colors";
import ValidateAccomplishmentForm from "~/components/challenge/forms/validateAccomplishmentForm";

type LoaderData = {
  accomplishmentResponse?: {
    accomplishment?: Accomplishment;
    error?: string;
    success?: string;
  };
};

type ActionData = {
  updateAccomplishmentResponse?: {
    formData?: CreateAccomplishmentFormData;
    error?: string;
    success?: string;
  };
  deleteAccomplishmentResponse?: {
    formData?: DeleteAccomplishmentFormData;
    error?: string;
    success?: string;
  };
};

async function loadAccomplishments(token: string, accomplishmentId: number) {
  const { code, ...accomplishmentResponse } = await getAccomplishment(
    token,
    accomplishmentId
  );

  return json({ accomplishmentResponse } as LoaderData, code);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.accomplishmentId) {
    throw json("Invalid accomplishment query", 400);
  }

  //Need to provide userId to filter in jsx
  const token = await requireAuth(
    request,
    `/accomplishments/${params.accomplishmentId}`
  );

  const { user } = await getSelft(token);

  return await loadAccomplishments(token, parseInt(params.accomplishmentId));
};

async function handleAccomplishmentUpdate(
  token: string,
  accomplishmentId: number,
  proof: Blob,
  comment: string
) {
  const fields = { comment, proof };

  const { code, ...updateAccomplishmentResponse } = await updateAccomplishment(
    token,
    accomplishmentId,
    fields.comment
  );

  if (updateAccomplishmentResponse.error) {
    return json(
      {
        updateAccomplishmentResponse: {
          ...updateAccomplishmentResponse,
          formData: { fields },
        },
      } as ActionData,
      code
    );
  }

  const { code: uploadCode, ...uploadProofResponse } = await putProof(
    token,
    accomplishmentId,
    proof
  );

  return json(
    {
      updateAccomplishmentResponse: {
        ...uploadProofResponse,
        formData: { fields },
      },
    } as ActionData,
    uploadCode
  );
}

async function handleDeleteAccomplishment(
  token: string,
  accomplishmentId: number
) {
  const { code, ...deleteAccomplishmentResponse } = await deleteAccomplishment(
    token,
    accomplishmentId
  );

  return json({ deleteAccomplishmentResponse } as ActionData, code);
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.accomplishmentId) {
    return json(
      {
        updateAccomplishmentResponse: { error: "Invalid accomplishment query" },
      } as ActionData,
      404
    );
  }

  const token = await requireAuth(
    request,
    `/accomplishments/${params.accomplishmentId}`
  );

  //Decalare all fields
  const form = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxFileSize: 100_000_000 })
  );
  const kind = form.get("kind");

  switch (request.method) {
    case "PATCH":
    case "accomplishment":
      const proof = form.get("proof");
      const comment = form.get("comment");

      if (typeof comment !== "string" || !(proof instanceof Blob)) {
        return json(
          {
            updateAccomplishmentResponse: {
              error:
                "Invalid data provided, please check if you have fill all the requierd fields",
            },
          } as ActionData,
          400
        );
      }

      return await handleAccomplishmentUpdate(
        token,
        parseInt(params.accomplishmentId),
        proof,
        comment
      );

    case "DELETE":
    case "accomplishment":
      return await handleDeleteAccomplishment(
        token,
        parseInt(params.accomplishmentId)
      );

    default:
      throw json("Bad request method", 404);
  }
};

//If accomplishment creator is self transform normal inputs into a form to update it
function displayAccomplishment(
  accomplishment: Accomplishment,
  formData: {
    updateForm?: CreateAccomplishmentFormData;
    deleteForm?: DeleteAccomplishmentFormData;
    validateForm?: ValidateAccomplishmentFormData;
  },
  userId?: number,
  userPrivilege?: number
) {
  if (userId === accomplishment.userId || userId === accomplishment.user?.id) {
    return (
      <Container>
        <UpdateAccomplishmentForm
          accomplishment={accomplishment}
          formData={formData?.updateForm}
        />
        <DeleteAccomplishmentForm
          accomplishment={accomplishment}
          formData={formData?.deleteForm}
        />
        <ValidateAccomplishmentForm
          formData={formData.validateForm}
          accomplishment={accomplishment}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <AccomplishmentDisplay
          validateFormData={formData.validateForm}
          userPrivilege={userPrivilege}
          accomplishment={accomplishment}
        />
      </Container>
    );
  }
}

export default function Accomplishment() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const { userInfo } = useOutletContext<ContextData>();

  const transition = useTransition();

  return (
    <Container style={{ marginTop: "50px" }} maxWidth="md">
      <Typography textAlign="center" variant="h4">
        Accomplishment
      </Typography>
      {generateAlert("error", loaderData.accomplishmentResponse?.error)}
      {generateAlert("error", actionData?.updateAccomplishmentResponse?.error)}
      {generateAlert(
        "success",
        actionData?.updateAccomplishmentResponse?.success
      )}
      {generateAlert("error", actionData?.deleteAccomplishmentResponse?.error)}
      {generateAlert(
        "success",
        actionData?.deleteAccomplishmentResponse?.success
      )}
      {loaderData.accomplishmentResponse?.accomplishment && (
        <Container>
          {displayAccomplishment(
            loaderData.accomplishmentResponse.accomplishment,
            {
              updateForm: actionData?.updateAccomplishmentResponse?.formData,
              deleteForm: actionData?.deleteAccomplishmentResponse?.formData,
            },
            userInfo?.id,
            userInfo?.privilege
          )}
        </Container>
      )}
      {transition.state === "submitting" && (
        <CircularProgress
          size={36}
          sx={{
            color: blue[500],
            position: "absolute",
            left: "50%",
            marginTop: "18px",
            marginLeft: "-18px",
          }}
        />
      )}
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
