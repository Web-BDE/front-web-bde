import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
  useSearchParams,
} from "remix";

import { requireAuth } from "~/services/authentication";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import { Container, Typography } from "@mui/material";
import AccomplishmentsGrid, {
  AccomplishmentData,
} from "~/components/challenge/accomplishmentGrid";
import { ValidateAccomplishmentFormData } from "~/components/challenge/accomplishmentTile";
import CreateChallengeForm, {
  CreateChallengeFormData,
} from "~/components/challenge/createChallengeForm";
import {
  getManyAccomplishment,
  updateAccomplishment,
} from "~/services/accomplishment";
import { APIError } from "~/utils/axios";
import { createChallenge } from "~/services/challenges";
import { Validation } from "~/models/Accomplishment";

type ActionData = {
  createChallenge?: CreateChallengeFormData;
  validateAccomplishment?: ValidateAccomplishmentFormData;
};

async function loadAccomplishments(token: string) {
  //Try to get accomplishments
  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(token);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the component instead
    if (err instanceof APIError) {
      return {
        accomplishmenError: err.error.message,
      };
    }
    throw err;
  }
  return { accomplishments };
}

export const loader: LoaderFunction = async ({ request }) => {
  //User need to be logged in
  const token = await requireAuth(request, `/challenges/admin`);

  return { accomplishments: await loadAccomplishments(token) };
};

//Validator for validation input
function validateValidation(validation: Validation) {
  if (validation !== Validation.PENDING) {
    return "Validation has invalid value";
  }
}

async function handleValidateAccomplishment(
  token: string,
  validation: Validation,
  accomplishmentId: number
) {
  //Check for an error in the validation format
  const validationError = validateValidation(validation);

  if (validationError) {
    return json(
      {
        validateChallenge: { formError: validationError },
      },
      400
    );
  }

  //Try to validate challenge
  try {
    await updateAccomplishment(token, accomplishmentId, undefined, validation);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          validateChallenge: { formError: err.error.message },
        },
        err.code
      );
    }
    throw err;
  }

  return json({
    validateChallenge: { formSuccess: "Challenge Validated" },
  });
}

//Validator for field reward
function validateReward(reward: number) {
  if (reward < 0) {
    return "Reward must be positive";
  }
}

export async function handleChallengeCreation(
  token: string,
  name: string,
  reward: number,
  redirectTo: string,
  description?: string
) {
  //Check fields format errors
  const fields = { name, description, reward: reward };
  const fieldsError = {
    reward: validateReward(reward),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ createChallenge: { fields, fieldsError } }, 400);
  }

  //Try to create challenge
  try {
    await createChallenge(token, fields);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          createChallenge: { formError: err.error.message, fields },
        },
        err.code
      );
    }
  }

  return redirect(redirectTo);
}

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
        typeof accomplishmentId !== "string" ||
        (validation !== "ACCEPTED" &&
          validation !== "PENDING" &&
          validation !== "REFUSED")
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
        Validation[validation],
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
  const loaderData = useLoaderData<{ accomplishments: AccomplishmentData }>();

  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Container maxWidth="xs">
        <Typography variant="h4">Create Challenge</Typography>
        <CreateChallengeForm
          formData={actionData?.createChallenge}
          redirectTo={searchParams.get("redirectTo")}
        />
      </Container>
      {/* Display a list of accomplishments that need to be validated */}
      <AccomplishmentsGrid
        accomplishments={loaderData.accomplishments}
        formData={{
          validateAccomplishment: actionData?.validateAccomplishment,
        }}
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
