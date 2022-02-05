import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import Accomplishments from "~/components/accomplishments";
import {
  handleAccomplishmentCreation,
  handleAccomplishmentUpdate,
  handleDeleteAccomplishment,
} from "~/controllers/accomplishment";
import {
  handleChallengeUpdate,
  handleDeleteChallenge,
} from "~/controllers/challenge";

import { Accomplishment } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";

import { getManyAccomplishment } from "~/services/accomplishment";
import { requireUserInfo } from "~/services/authentication";
import { getChallenge } from "~/services/challenges";
import { APIError } from "~/utils/axios";

import {
  generateUnexpectedError,
  generateExpectedError,
} from "../../controllers/error";

import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Container,
  CssBaseline,
  Alert,
} from "@mui/material";

type LoaderData = {
  challenge: Challenge;
  userId: number;
  accomplishments?: {
    accomplishments?: Accomplishment[];
    error?: string;
    userId: number;
    challengeId: number;
  };
};

type ActionData = {
  creacteAccomplishment?: {
    formError?: string;
    formSuccess?: string;
    fieldsError?: {
      proof?: string;
    };
    fields?: {
      proof: string;
    };
  };
  updateAccomplishment?: {
    formError?: string;
    formSuccess?: string;
    fieldsError?: {
      proof?: string;
    };
    fields?: {
      proof: string;
    };
  };
  updateChallenge?: {
    formError?: string;
    formSuccess?: string;
    fieldsError?: {
      name?: string;
      description?: string;
      reward?: string;
    };
    fields?: {
      name: string;
      description?: string;
      reward: number;
    };
  };
  deleteAccomplishment?: {
    formError?: string;
    formSuccess?: string;
  };
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
  const userInfo = await requireUserInfo(
    request,
    `/challenge/${params.challengeId}`
  );

  const challenge = await getChallenge(request, parseInt(params.challengeId));

  //Get Accomplishments, we don't throw API Errors because we will display them
  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(request);
  } catch (error) {
    if (error instanceof APIError) {
      return {
        challenge,
        accomplishments: {
          error: error.error.message,
          userId: userInfo.userId,
          challengeId: challenge.id,
        },
      };
    }
    throw error;
  }

  return {
    challenge,
    userId: userInfo.userId,
    accomplishments: {
      accomplishments,
      userId: userInfo.userId,
      challengeId: challenge.id,
    },
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 404);
  }

  await requireUserInfo(request, `/challenge/${params.challengeId}`);

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
        request,
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
        request,
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
        request,
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
        request,
        parseInt(accomplishmentId)
      );
    case "delete-challenge":
      await handleDeleteChallenge(request, parseInt(params.challengeId));

      return redirect("/challenges");
    default:
      throw new Error("There was an error during form handling");
  }
};

//If challenge creator is self transform normal inputs into a form to update it
function displayChallenge(
  challenge: Challenge,
  userId: number,
  actionData?: ActionData
) {
  if (userId === challenge.creatorId) {
    return (
      <Container maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography variant="h4">Challenge</Typography>
          {actionData?.updateChallenge?.formError ? (
            <Alert severity="error">
              {actionData?.updateChallenge.formError}
            </Alert>
          ) : (
            ""
          )}
          {actionData?.updateChallenge?.formSuccess ? (
            <Alert severity="info">
              {actionData?.updateChallenge.formSuccess}
            </Alert>
          ) : (
            ""
          )}
          <form method="post">
            <input type="hidden" name="method" value="update-challenge" />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              error={Boolean(actionData?.updateChallenge?.fieldsError?.name)}
              helperText={actionData?.updateChallenge?.fieldsError?.name}
              label="Name"
              name="name"
              autoComplete="name"
              defaultValue={
                actionData?.updateChallenge?.fields?.name || challenge.name
              }
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={Boolean(
                actionData?.updateChallenge?.fieldsError?.description
              )}
              helperText={actionData?.updateChallenge?.fieldsError?.description}
              name="description"
              defaultValue={
                actionData?.updateChallenge?.fields?.description ||
                challenge.description
              }
              label="description"
              id="description"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={Boolean(actionData?.updateChallenge?.fieldsError?.reward)}
              helperText={actionData?.updateChallenge?.fieldsError?.reward}
              name="reward"
              defaultValue={
                actionData?.updateChallenge?.fields?.reward || challenge.reward
              }
              label="reward"
              type="number"
              id="reward"
            />
            <Typography variant="h6" style={{ marginTop: "10px" }}>
              Created : {challenge.createdAt}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
            >
              Update Challenge
            </Button>
          </form>
        </div>
      </Container>
    );
  } else {
    return (
      <Container maxWidth="xs">
        <Typography variant="h4">Challenge</Typography>
        <Typography variant="h3" style={{ marginTop: "10px" }}>
          {challenge.name}
        </Typography>
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          <b>Reward : {challenge.reward}</b>
        </Typography>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          {challenge.description}
        </Typography>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Created : {challenge.createdAt}
        </Typography>
      </Container>
    );
  }
}

export default function Challenge() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      {displayChallenge(loaderData.challenge, loaderData.userId, actionData)}
      <Container maxWidth="xs" style={{ marginTop: "50px" }}>
        <CssBaseline />
        <div>
          <Typography variant="h4">Submit Proof</Typography>
          {actionData?.updateAccomplishment?.formError ? (
            <Alert severity="error">
              {actionData?.updateAccomplishment?.formError}
            </Alert>
          ) : (
            ""
          )}
          {actionData?.updateChallenge?.formSuccess ? (
            <Alert severity="info">
              {actionData?.updateAccomplishment?.formSuccess}
            </Alert>
          ) : (
            ""
          )}
          <form method="post">
            <input type="hidden" name="method" value="create-accomplishment" />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="proof"
              error={Boolean(
                actionData?.updateAccomplishment?.fieldsError?.proof
              )}
              helperText={actionData?.updateAccomplishment?.fieldsError?.proof}
              label="Proof"
              name="proof"
              autoComplete="proof"
              defaultValue={actionData?.updateAccomplishment?.fields?.proof}
              autoFocus
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit Proof
            </Button>
          </form>
        </div>
      </Container>
      {/* Display all user's accomplishment for this challenge */}
      {loaderData.accomplishments ? (
        <Accomplishments
          accomplishments={loaderData.accomplishments}
          formData={actionData?.updateAccomplishment}
        />
      ) : (
        ""
      )}
    </div>
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
