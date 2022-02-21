import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useCatch,
  useLoaderData,
  useSearchParams,
} from "remix";

import { Accomplishment } from "~/models/Accomplishment";

import { requireAuth } from "~/services/authentication";

import AccomplishmentsAdmin from "~/components/accomplishmentsAdmin";

import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import {
  handleValidateAccomplishment,
  loadAccomplishments,
} from "~/controllers/accomplishment";
import { handleChallengeCreation } from "~/controllers/challenge";

import { TextField, Button, Typography, Container, Alert } from "@mui/material";

type ActionData = {
  createChallenge?: {
    formError?: string;
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
  validateChallenge?: {
    validationError?: string;
  };
};

type LoaderData = {
  accomplishments?: Accomplishment[];
  accomplishmentError?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  //User need to be logged in
  const token = await requireAuth(request, `/challenges/admin`);

  return await loadAccomplishments(token);
};

export const action: ActionFunction = async ({ request }) => {
  //User need to be logged in
  const token = await requireAuth(request, `/challenges/admin`);

  //Declare all fields
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");
  const method = form.get("method");
  //Validation fields
  const validation = form.get("validation");
  const accomplishmentId = form.get("accomplishmentId");
  //Challenge creation fields
  const name = form.get("name");
  const description = form.get("description");
  const reward = form.get("reward");

  //Validation request
  switch (method) {
    case "validate-accomplishment":
      //Should never happend
      if (
        typeof validation !== "string" ||
        typeof accomplishmentId !== "string"
      ) {
        return json(
          {
            validateChallenge: {
              validationError: "There was an error, please try again",
            },
          },
          400
        );
      }

      return await handleValidateAccomplishment(
        token,
        null,
        parseInt(accomplishmentId)
      );

    case "create-challenge":
      //Redirection undefined, should never happend
      if (typeof redirectTo !== "string") {
        return json(
          {
            createChallenge: {
              formError: "There was an error, please try again",
            },
          },
          400
        );
      }

      //Check for undefined values
      if (
        typeof name !== "string" ||
        (typeof description !== "string" && description !== null) ||
        typeof reward !== "string"
      ) {
        return json({
          createChallenge: { formError: "You must fill all the fields" },
        });
      }

      return await handleChallengeCreation(
        token,
        name,
        parseInt(reward),
        redirectTo,
        description ? description : undefined
      );
    default:
      throw new Error("There was an error during form handling");
  }
};

export default function ChallengesAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<LoaderData>();

  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Container maxWidth="xs">
        <Typography variant="h4">Create Challenge</Typography>
        {actionData?.createChallenge?.formError ? (
          <Alert severity="error">
            {actionData?.createChallenge.formError}
          </Alert>
        ) : (
          ""
        )}
        <form method="post">
          {/* Hidden input with redirection URL in it */}
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") || "/challenges"}
          />
          {/* Method that the Action function will have to handle */}
          <input type="hidden" name="method" value="create-challenge" />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            error={Boolean(actionData?.createChallenge?.fieldsError?.name)}
            helperText={actionData?.createChallenge?.fieldsError?.name}
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={actionData?.createChallenge?.fields?.name}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            error={Boolean(
              actionData?.createChallenge?.fieldsError?.description
            )}
            helperText={actionData?.createChallenge?.fieldsError?.description}
            name="description"
            defaultValue={actionData?.createChallenge?.fields?.description}
            label="description"
            id="description"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(actionData?.createChallenge?.fieldsError?.reward)}
            helperText={actionData?.createChallenge?.fieldsError?.reward}
            name="reward"
            defaultValue={actionData?.createChallenge?.fields?.reward || 0}
            label="reward"
            type="number"
            id="reward"
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Create Challenge
          </Button>
        </form>
      </Container>
      {/* Display a list of accomplishments that need to be validated */}
      <AccomplishmentsAdmin loaderData={loaderData} actionData={actionData} />
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
