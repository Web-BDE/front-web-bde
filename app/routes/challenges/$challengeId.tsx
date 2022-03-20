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
  Challenge,
  CreateChallengeFormData,
  DeleteChallengeFormData,
} from "~/models/Challenge";

import {
  createAccomplishment,
  deleteAccomplishment,
  getManyAccomplishment,
  putProof,
  updateAccomplishment,
} from "~/services/accomplishment";
import { requireAuth } from "~/services/authentication";
import {
  deleteChallenge,
  getChallenge,
  putChallengePicture,
  updateChallenge,
} from "~/services/challenges";

import {
  generateUnexpectedError,
  generateExpectedError,
  generateAlert,
} from "../../utils/error";

import { Container, Typography, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useContext } from "react";
import UpdateChallengeForm from "~/components/challenge/forms/updateChallengeForm";
import ChallengeDisplay from "~/components/challenge/challengeDisplay";
import AccomplishmentsGrid from "~/components/challenge/grids/accomplishmentGrid";
import CreateAccomplishmentForm from "~/components/challenge/forms/createAccomplishmentForm";
import DeleteChallengeForm from "~/components/challenge/forms/deleteChallengeForm";
import {
  Accomplishment,
  CreateAccomplishmentFormData,
  DeleteAccomplishmentFormData,
} from "~/models/Accomplishment";
import { ContextData } from "~/root";
import { getSelft, getUser } from "~/services/user";
import { User } from "~/models/User";
import AccomplishmentAdminList from "~/components/challenge/accomplishmentAdminList";
import AccomplishmentList from "~/components/challenge/accomplishmentList";

type LoaderData = {
  challengeResponse?: {
    challenge?: Challenge;
    error?: string;
    success?: string;
  };
  accomplishmentResponse?: {
    accomplishments?: Accomplishment[];
    error?: string;
    success?: string;
  };
};

type ActionData = {
  createAccomplishmentResponse?: {
    formData?: CreateAccomplishmentFormData;
    error?: string;
    success?: string;
  };
  updateAccomplishmentResponse?: {
    formData?: CreateAccomplishmentFormData;
    error?: string;
    success?: string;
  };
  updateChallengeResponse?: {
    formData?: CreateChallengeFormData;
    error?: string;
    success?: string;
  };
  deleteAccomplishmentResponse?: {
    formData?: DeleteAccomplishmentFormData;
    error?: string;
    success?: string;
  };
  deleteChallengeResponse?: {
    formData?: DeleteChallengeFormData;
    error?: string;
    success?: string;
  };
};

async function loadAccomplishments(
  token: string,
  challengeId?: number,
  userId?: number
) {
  const { code, ...accomplishmentResponse } = await getManyAccomplishment(
    token,
    100,
    0,
    challengeId,
    userId
  );

  return accomplishmentResponse;
}

async function loadChallenge(
  token: string,
  challengeId: number,
  userId?: number
) {
  const { code, ...challengeResponse } = await getChallenge(token, challengeId);

  return json(
    {
      challengeResponse: {
        ...challengeResponse,
      },
      accomplishmentResponse: await loadAccomplishments(
        token,
        challengeResponse.challenge?.id,
        userId
      ),
    } as LoaderData,
    code
  );
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  //Need to provide userId to filter in jsx
  const token = await requireAuth(request, `/challenge/${params.challengeId}`);

  const { user } = await getSelft(token);

  return await loadChallenge(token, parseInt(params.challengeId), user?.id);
};

async function handleAccomplishmentCreation(
  token: string,
  challengeId: number,
  proof: Blob,
  comment?: string
) {
  const fields = { comment, proof };

  const { code, ...createAccomplishmentResponse } = await createAccomplishment(
    token,
    fields,
    challengeId
  );

  if (
    createAccomplishmentResponse.error ||
    !createAccomplishmentResponse.accomplishmentId
  ) {
    return json(
      {
        createAccomplishmentResponse: {
          ...createAccomplishmentResponse,
          formData: { fields },
        },
      } as ActionData,
      code
    );
  }

  console.log(createAccomplishmentResponse.accomplishmentId);

  const { code: uploadCode, ...proofUploadResponse } = await putProof(
    token,
    createAccomplishmentResponse.accomplishmentId,
    proof
  );

  return json(
    {
      createAccomplishmentResponse: {
        ...proofUploadResponse,
        formData: { fields },
      },
    } as ActionData,
    uploadCode
  );
}

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

//Validator for field reward
function validateRécompense(reward: number) {
  if (reward < 0) {
    return "La récompense doit être positive";
  }
}

//Validator for buy limit field
function validateMaxAtempts(maxAtempts: number) {
  if (maxAtempts < 1) {
    return "le nombre maximum d'essais doit être positif";
  }
}

async function handleChallengeUpdate(
  token: string,
  name: string,
  description: string,
  reward: number,
  maxAtempts: number,
  challengeId: number,
  picture: Blob
) {
  //Check fields format errors
  const fields = { name, description, reward, maxAtempts, picture };
  const fieldsError = {
    reward: validateRécompense(reward),
    maxAtempts: validateMaxAtempts(maxAtempts),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json(
      {
        updateChallengeResponse: { formData: { fields, fieldsError } },
      } as ActionData,
      400
    );
  }

  const { code, ...updateChallengeResponse } = await updateChallenge(
    token,
    fields,
    challengeId
  );

  if (updateChallengeResponse.error || !updateChallengeResponse.challengeId) {
    return json(
      {
        updateChallengeResponse: {
          ...updateChallengeResponse,
          formData: { fields, fieldsError },
        },
      } as ActionData,
      code
    );
  }

  const { code: uploadCode, ...uploadPictureResponse } =
    await putChallengePicture(
      token,
      updateChallengeResponse.challengeId,
      picture
    );

  return json(
    {
      updateChallengeResponse: {
        ...uploadPictureResponse,
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

async function handleDeleteChallenge(token: string, challengeId: number) {
  const { code, ...deleteChallengeResponse } = await deleteChallenge(
    token,
    challengeId
  );

  if (deleteChallengeResponse.error) {
    return json({ deleteChallengeResponse } as ActionData, code);
  }

  return redirect("/challenges");
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    return json(
      {
        updateChallengeResponse: { error: "Invalid challenge query" },
      } as ActionData,
      404
    );
  }

  const token = await requireAuth(request, `/challenge/${params.challengeId}`);

  //Decalare all fields
  const form = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxFileSize: 100_000_000 })
  );
  const kind = form.get("kind");

  switch (request.method) {
    case "PUT":
      //Accomplishment creation
      const comment = form.get("comment");
      const proof = form.get("proof");

      if (typeof comment !== "string" || !(proof instanceof Blob)) {
        return json(
          {
            createAccomplishmentResponse: {
              error: "Quelque chose s'est mal passé, veuillez réessayer",
            },
          } as ActionData,
          500
        );
      }

      return await handleAccomplishmentCreation(
        token,
        parseInt(params.challengeId),
        proof,
        comment
      );
    case "PATCH":
      switch (kind) {
        case "accomplishment":
          const proof = form.get("proof");
          const comment = form.get("comment");
          const accomplishmentId = new URL(request.url).searchParams.get(
            "accomplishmentId"
          );

          if (!accomplishmentId) {
            return json(
              {
                validateAccomplishmentResponse: {
                  error: "Invalid accomplishment query",
                },
              } as ActionData,
              404
            );
          }

          if (typeof comment !== "string" || !(proof instanceof Blob)) {
            return json(
              {
                updateAccomplishmentResponse: {
                  error:
                    "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
                },
              } as ActionData,
              400
            );
          }

          return await handleAccomplishmentUpdate(
            token,
            parseInt(accomplishmentId),
            proof,
            comment
          );

        case "challenge":
          //Challenge update
          const name = form.get("name");
          const description = form.get("description");
          const reward = form.get("reward");
          const maxAtempts = form.get("max-atempts");
          const picture = form.get("picture");

          if (
            typeof name !== "string" ||
            (typeof description !== "string" &&
              typeof description !== "undefined") ||
            typeof reward !== "string" ||
            typeof maxAtempts !== "string" ||
            !(picture instanceof Blob)
          ) {
            return json(
              {
                updateChallengeResponse: {
                  error:
                    "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
                },
              } as ActionData,
              400
            );
          }

          return await handleChallengeUpdate(
            token,
            name,
            description,
            parseInt(reward),
            parseInt(maxAtempts),
            parseInt(params.challengeId),
            picture
          );

        default:
          return json(
            {
              updateChallengeResponse: { error: "Bad request kind" },
            } as ActionData,
            404
          );
      }
    case "DELETE":
      switch (kind) {
        case "accomplishment":
          const accomplishmentId = new URL(request.url).searchParams.get(
            "accomplishmentId"
          );

          if (!accomplishmentId) {
            return json(
              {
                validateAccomplishmentResponse: {
                  error: "Invalid accomplishment query",
                },
              } as ActionData,
              404
            );
          }

          return await handleDeleteAccomplishment(
            token,
            parseInt(accomplishmentId)
          );

        case "challenge":
          return await handleDeleteChallenge(
            token,
            parseInt(params.challengeId)
          );

        default:
          return json(
            {
              deleteChallengeResponse: { error: "Bad request kind" },
            } as ActionData,
            404
          );
      }

    default:
      throw json("Bad request method", 404);
  }
};

//If challenge Auteur is self transform normal inputs into a form to update it
function displayChallenge(
  challenge: Challenge,
  formData: {
    updateForm?: CreateChallengeFormData;
    deleteForm?: DeleteChallengeFormData;
  },
  userId?: number,
  API_URL?: string
) {
  if (userId === challenge.creatorId || userId === challenge.creator?.id) {
    return (
      <Container>
        <UpdateChallengeForm
          API_URL={API_URL}
          challenge={challenge}
          formData={formData?.updateForm}
        />
        <DeleteChallengeForm
          challenge={challenge}
          formData={formData?.deleteForm}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <ChallengeDisplay API_URL={API_URL} challenge={challenge} />
      </Container>
    );
  }
}

export default function Challenge() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const { userInfo, API_URL } = useOutletContext<ContextData>();

  const transition = useTransition();

  return (
    <Container style={{ marginTop: "50px" }}>
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Typography variant="h4">Challenge</Typography>
        {generateAlert("error", loaderData.challengeResponse?.error)}
        {generateAlert("error", actionData?.updateChallengeResponse?.error)}
        {generateAlert("success", actionData?.updateChallengeResponse?.success)}
        {generateAlert("error", actionData?.deleteChallengeResponse?.error)}
        {generateAlert("success", actionData?.deleteChallengeResponse?.success)}
        {generateAlert(
          "info",
          loaderData.challengeResponse?.success &&
            !loaderData.challengeResponse?.challenge
            ? "Désolé, impossible de trouver le challenge que vous cherchez"
            : undefined
        )}
        {loaderData.challengeResponse?.challenge && (
          <Container>
            {displayChallenge(
              loaderData.challengeResponse.challenge,
              {
                updateForm: actionData?.updateChallengeResponse?.formData,
                deleteForm: actionData?.deleteChallengeResponse?.formData,
              },
              userInfo?.id,
              API_URL
            )}
            <Typography marginTop="50px" variant="h4">
              Submit Proof
            </Typography>
            {generateAlert(
              "error",
              actionData?.createAccomplishmentResponse?.error
            )}
            {generateAlert(
              "success",
              actionData?.createAccomplishmentResponse?.success
            )}
            <CreateAccomplishmentForm
              formData={actionData?.createAccomplishmentResponse?.formData}
              challenge={loaderData.challengeResponse.challenge}
            />
          </Container>
        )}
      </Container>
      <Container style={{ marginTop: "50px" }}>
        <Typography marginBottom={"50px"} textAlign="center" variant="h4">
          Your accomplishments
        </Typography>
        {generateAlert(
          "error",
          actionData?.updateAccomplishmentResponse?.error
        )}
        {generateAlert(
          "success",
          actionData?.updateAccomplishmentResponse?.success
        )}
        {generateAlert(
          "error",
          actionData?.deleteAccomplishmentResponse?.error
        )}
        {generateAlert(
          "success",
          actionData?.deleteAccomplishmentResponse?.success
        )}
        {generateAlert(
          "info",
          loaderData.accomplishmentResponse?.success &&
            (!loaderData.accomplishmentResponse?.accomplishments ||
              loaderData.accomplishmentResponse.accomplishments.length === 0)
            ? "Il n'y a actuellement aucun accomplissement"
            : undefined
        )}
        {loaderData.accomplishmentResponse?.accomplishments &&
          loaderData.accomplishmentResponse.accomplishments.length !== 0 && (
            <AccomplishmentList
              accomplishments={
                loaderData.accomplishmentResponse.accomplishments
              }
            />
          )}
      </Container>
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
