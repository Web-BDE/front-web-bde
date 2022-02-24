import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
  useOutletContext
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
  updateAccomplishment,
} from "~/services/accomplishment";
import { requireAuth } from "~/services/authentication";
import {
  deleteChallenge,
  getChallenge,
  updateChallenge,
} from "~/services/challenges";

import {
  generateUnexpectedError,
  generateExpectedError,
  generateAlert,
} from "../../utils/error";

import { Container, Typography } from "@mui/material";
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
import { Params } from "react-router";

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

async function loadAccomplishment(
  token: string,
  challengeResponse: {
    error?: string;
    success?: string;
    challenge?: Challenge;
  },
  challengeCode: number,
  userId?: number
) {
  const { code, ...accomplishmentResponse } = await getManyAccomplishment(
    token,
    100,
    0,
    challengeResponse.challenge?.id,
    userId
  );

  return json(
    { challengeResponse, accomplishmentResponse } as LoaderData,
    challengeCode
  );
}

async function loadChallenge(
  token: string,
  challengeId: number,
  userId?: number
) {
  const { code, ...challengeResponse } = await getChallenge(token, challengeId);

  return loadAccomplishment(token, challengeResponse, code, userId);
}

export const loader: LoaderFunction = async ({
  request,
  params,
  context,
}: {
  request: Request;
  params: Params<string>;
  context: ContextData;
}) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  //Need to provide userId to filter in jsx
  const token = await requireAuth(request, `/challenge/${params.challengeId}`);

  const userInfo = context.userInfo;

  return await loadChallenge(token, parseInt(params.challengeId), userInfo?.id);
};

async function handleAccomplishmentCreation(
  token: string,
  proof: string,
  challengeId: number
) {
  const fields = { proof };

  const { code, ...createAccomplishmentResponse } = await createAccomplishment(
    token,
    fields,
    challengeId
  );

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

async function handleAccomplishmentUpdate(
  token: string,
  proof: string,
  accomplishmentId: number
) {
  const fields = { proof };

  const { code, ...updateAccomplishmentResponse } = await updateAccomplishment(
    token,
    accomplishmentId,
    fields
  );

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

//Validator for field reward
function validateReward(reward: number) {
  if (reward < 0) {
    return "Reward must be positive";
  }
}

async function handleChallengeUpdate(
  token: string,
  name: string,
  description: string,
  reward: number,
  challengeId: number
) {
  //Check fields format errors
  const fields = { name, description, reward: reward };
  const fieldsError = {
    reward: validateReward(reward),
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
  const form = await request.formData();
  const kind = form.get("kind");

  switch (request.method) {
    case "PUT":
      //Accomplishment creation
      const proof = form.get("proof");

      if (typeof proof !== "string") {
        return json(
          {
            createAccomplishmentResponse: {
              error: "Something went wrong, please try again",
            },
          } as ActionData,
          500
        );
      }

      return await handleAccomplishmentCreation(
        token,
        proof,
        parseInt(params.challengeId)
      );
    case "PATCH":
      switch (kind) {
        case "accomplishment":
          const proof = form.get("proof");
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

          if (typeof proof !== "string") {
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
            proof,
            parseInt(accomplishmentId)
          );

        case "challenge":
          //Challenge update
          const name = form.get("name");
          const description = form.get("description");
          const reward = form.get("reward");

          if (
            typeof name !== "string" ||
            (typeof description !== "string" &&
              typeof description !== "undefined") ||
            typeof reward !== "string"
          ) {
            return json(
              {
                updateChallengeResponse: {
                  error:
                    "Invalid data provided, please check if you have fill all the requierd fields",
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
            parseInt(params.challengeId)
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

//If challenge creator is self transform normal inputs into a form to update it
function displayChallenge(
  challenge: Challenge,
  formData: {
    updateForm?: CreateChallengeFormData;
    deleteForm?: DeleteChallengeFormData;
  },
  userId?: number
) {
  if (userId === challenge.creatorId) {
    return (
      <Container maxWidth="xs">
        <UpdateChallengeForm
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
      <Container maxWidth="xs">
        <ChallengeDisplay challenge={challenge} />
      </Container>
    );
  }
}

export default function Challenge() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const userInfo = useOutletContext<ContextData>().userInfo;

  return (
    <Container style={{ marginTop: "50px" }}>
      <Container maxWidth="xs" style={{ marginTop: "50px" }}>
        <Typography variant="h4">Challenge</Typography>
        {generateAlert("error", loaderData.challengeResponse?.error)}
        {generateAlert("error", actionData?.updateChallengeResponse?.error)}
        {generateAlert("success", actionData?.updateChallengeResponse?.success)}
        {generateAlert("error", actionData?.deleteChallengeResponse?.error)}
        {generateAlert("success", actionData?.deleteChallengeResponse?.success)}
        {loaderData.challengeResponse?.challenge && (
          <div>
            {displayChallenge(
              loaderData.challengeResponse.challenge,
              {
                updateForm: actionData?.updateChallengeResponse?.formData,
                deleteForm: actionData?.deleteChallengeResponse?.formData,
              },
              userInfo?.id
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
          </div>
        )}
      </Container>
      {/* Display all user's accomplishment for this challenge */}
      {loaderData.accomplishmentResponse?.accomplishments && (
        <div style={{ marginTop: "50px" }}>
          <Typography textAlign="center" variant="h4">
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
          <AccomplishmentsGrid
            accomplishments={loaderData.accomplishmentResponse.accomplishments}
            formData={{
              updateForm: actionData?.updateAccomplishmentResponse?.formData,
              deleteForm: actionData?.deleteAccomplishmentResponse?.formData,
            }}
          />
        </div>
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
