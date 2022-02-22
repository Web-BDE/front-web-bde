import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";

import {
  handleAccomplishmentCreation,
  handleAccomplishmentUpdate,
  handleDeleteAccomplishment,
} from "~/controllers/accomplishment";
import {
  handleChallengeUpdate,
  handleDeleteChallenge,
} from "~/controllers/challenge";

import { Challenge } from "~/models/Challenge";

import { getManyAccomplishment } from "~/services/accomplishment";
import { requireAuth } from "~/services/authentication";
import { getChallenge } from "~/services/challenges";
import { APIError } from "~/utils/axios";

import {
  generateUnexpectedError,
  generateExpectedError,
} from "../../utils/error";

import { TextField, Button, Typography, Container, Alert } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "~/components/userContext";
import UpdateChallengeForm, {
  UpdateChallengeFormData,
} from "~/components/challenge/updateChallengeForm";
import ChallengeDisplay from "~/components/challenge/challengeDisplay";
import AccomplishmentsGrid, {
  AccomplishmentData,
} from "~/components/challenge/accomplishmentGrid";
import { UpdateAccomplishmentFormData } from "~/components/challenge/updateAccomplishmentForm";
import { DeleteAccomplishmentFormData } from "~/components/challenge/deleteAccomplishmentForm";
import CreateAccomplishmentForm, {
  CreateAccomplishmentFormData,
} from "~/components/challenge/createAccomplishmentForm";

type LoaderData = {
  challenge: Challenge;
  accomplishments: AccomplishmentData;
};

type ActionData = {
  creacteAccomplishment?: CreateAccomplishmentFormData;
  updateAccomplishment?: UpdateAccomplishmentFormData;
  updateChallenge?: UpdateChallengeFormData;
  deleteAccomplishment?: DeleteAccomplishmentFormData;
  deleteChallenge?: {
    formError?: string;
    formSuccess?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  //Need to provide userId to filter in jsx
  const token = await requireAuth(request, `/challenge/${params.challengeId}`);

  const challenge = (await getChallenge(token, parseInt(params.challengeId)))
    ?.challenge;

  //Get Accomplishments, we don't throw API Errors because we will display them
  let accomplishments;
  try {
    accomplishments = (await getManyAccomplishment(token))?.accomplishments;
  } catch (error) {
    if (error instanceof APIError) {
      return {
        challenge,
        accomplishments: {
          error: error.error.message,
        },
      };
    }
    throw error;
  }

  return {
    challenge,
    accomplishments: {
      accomplishments,
    },
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 404);
  }

  const token = await requireAuth(request, `/challenge/${params.challengeId}`);

  //Decalare all fields
  const form = await request.formData();
  const method = form.get("method");
  //Accomplishment creation
  const proof = form.get("proof");
  //Accomplishment update
  const accomplishmentId = form.get("accomplishmentId");
  //Challenge update
  const name = form.get("name");
  const description = form.get("description");
  const reward = form.get("reward");

  switch (method) {
    case "create-accomplishment":
      if (typeof proof !== "string") {
        return json(
          {
            creacteAccomplishment: { formError: "You must fill all fields" },
          },
          400
        );
      }

      return await handleAccomplishmentCreation(
        token,
        proof,
        parseInt(params.challengeId)
      );
    case "update-accomplishment":
      if (typeof accomplishmentId !== "string") {
        return json(
          {
            updateAccomplishment: {
              formError: "There was an error, Please try again",
            },
          },
          400
        );
      }

      if (typeof proof !== "string") {
        return json(
          {
            updateAccomplishment: { formError: "You must fill all fields" },
          },
          400
        );
      }

      return await handleAccomplishmentUpdate(
        token,
        proof,
        parseInt(accomplishmentId)
      );
    case "update-challenge":
      if (
        typeof name !== "string" ||
        (typeof description !== "string" &&
          typeof description !== "undefined") ||
        typeof reward !== "string"
      ) {
        return json(
          {
            updateChallenge: { formError: "You must fill all the fields" },
          },
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
    case "delete-accomplishment":
      if (typeof accomplishmentId !== "string") {
        return json(
          {
            updateAccomplishment: { formError: "There was an error" },
          },
          400
        );
      }

      return await handleDeleteAccomplishment(
        token,
        parseInt(accomplishmentId)
      );
    case "delete-challenge":
      await handleDeleteChallenge(token, parseInt(params.challengeId));

      return redirect("/challenges");
    default:
      throw new Error("There was an error during form handling");
  }
};

//If challenge creator is self transform normal inputs into a form to update it
function displayChallenge(
  challenge: Challenge,
  userId?: number,
  formData?: UpdateChallengeFormData
) {
  if (userId === challenge.creatorId) {
    return (
      <Container maxWidth="xs">
        <UpdateChallengeForm challenge={challenge} formData={formData} />
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

  const userInfo = useContext(UserContext);

  return (
    <Container style={{ marginTop: "50px" }}>
      {displayChallenge(
        loaderData.challenge,
        userInfo?.id,
        actionData?.updateChallenge
      )}
      <Container maxWidth="xs" style={{ marginTop: "50px" }}>
        <CreateAccomplishmentForm
          formData={actionData?.creacteAccomplishment}
        />
      </Container>
      {/* Display all user's accomplishment for this challenge */}
      {loaderData.accomplishments ? (
        <AccomplishmentsGrid
          accomplishments={loaderData.accomplishments}
          formData={{
            updateAccomplishment: actionData?.updateAccomplishment,
            deleteAccomplishment: actionData?.deleteAccomplishment,
          }}
        />
      ) : (
        ""
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
