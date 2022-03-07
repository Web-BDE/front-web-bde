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

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { Container, Typography } from "@mui/material";
import AccomplishmentsGrid from "~/components/challenge/grids/accomplishmentGrid";
import CreateChallengeForm from "~/components/challenge/forms/createChallengeForm";
import {
  getManyAccomplishment,
  updateAccomplishment,
} from "~/services/accomplishment";
import { createChallenge } from "~/services/challenges";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
  Validation,
} from "~/models/Accomplishment";
import { CreateChallengeFormData } from "~/models/Challenge";

type ActionData = {
  createChallengeResponse?: {
    formData?: CreateChallengeFormData;
    error?: string;
    success?: string;
  };
  validateAccomplishmentResponse?: {
    formData?: ValidateAccomplishmentFormData;
    error?: string;
    success?: string;
  };
};

type LoaderData = {
  accomplishmentResponse?: {
    error?: string;
    success?: string;
    accomplishments?: Accomplishment[];
  };
};

async function loadAccomplishments(token: string) {
  const { code, ...accomplishmentResponse } = await getManyAccomplishment(
    token,
    100,
    0,
    undefined,
    undefined,
    "PENDING"
  );

  return json({ accomplishmentResponse } as LoaderData, code);
}

export const loader: LoaderFunction = async ({ request }) => {
  //User need to be logged in
  const token = await requireAuth(request, `/challenges/admin`);

  return await loadAccomplishments(token);
};

async function handleValidateAccomplishment(
  token: string,
  validation: Validation,
  accomplishmentId: number
) {
  const { code, ...validateAccomplishmentResponse } =
    await updateAccomplishment(token, accomplishmentId, undefined, validation);

  return json({ validateAccomplishmentResponse } as ActionData, code);
}

//Validator for field reward
function validateReward(reward: number) {
  if (reward < 0) {
    return "Reward must be positive";
  }
}

//Validator for field reward
function validateMaxAtempts(maxAtempts: number) {
  if (maxAtempts < 1) {
    return "Max Atempts must be more than 0";
  }
}

export async function handleChallengeCreation(
  token: string,
  name: string,
  reward: number,
  maxAtempts: number,
  description?: string
) {
  //Check fields format errors
  const fields = { name, description, reward, maxAtempts };
  const fieldsError = {
    reward: validateReward(reward),
    maxAtempts: validateMaxAtempts(maxAtempts),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json(
      {
        createChallengeResponse: { formData: { fields, fieldsError } },
      } as ActionData,
      400
    );
  }

  const { code, ...createChallengeResponse } = await createChallenge(
    token,
    fields
  );

  if (createChallengeResponse.error) {
    return json(
      {
        createChallengeResponse: {
          ...createChallengeResponse,
          formData: { fields, fieldsError },
        },
      } as ActionData,
      code
    );
  }

  return redirect("/challenges");
}

export const action: ActionFunction = async ({ request }) => {
  //User need to be logged in
  const token = await requireAuth(request, `/challenges/admin`);

  //Declare all fields
  const form = await request.formData();

  //Validation request
  switch (request.method) {
    case "PATCH":
      //Validation fields
      const validation = form.get("validation");
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

      //Should never happend
      if (validation !== "ACCEPTED" && validation !== "REFUSED") {
        return json(
          {
            validateAccomplishmentResponse: {
              error: "There was an error, please try again",
            },
          } as ActionData,
          500
        );
      }

      return await handleValidateAccomplishment(
        token,
        validation,
        parseInt(accomplishmentId)
      );

    case "PUT":
      //Challenge creation fields
      const name = form.get("name");
      const description = form.get("description");
      const reward = form.get("reward");
      const maxAtempts = form.get("max-atempts");

      //Check for undefined values
      if (
        typeof name !== "string" ||
        (typeof description !== "string" && description !== null) ||
        typeof reward !== "string" ||
        typeof maxAtempts !== "string"
      ) {
        return json(
          {
            createChallengeResponse: {
              error:
                "Invalid data provided, please check if you have fill all the requierd fields",
            },
          } as ActionData,
          400
        );
      }

      return await handleChallengeCreation(
        token,
        name,
        parseInt(reward),
        parseInt(maxAtempts),
        description ? description : undefined
      );

    default:
      throw json("Bad request method", 404);
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
        {generateAlert("error", actionData?.createChallengeResponse?.error)}
        {generateAlert("success", actionData?.createChallengeResponse?.success)}
        <CreateChallengeForm
          formData={actionData?.createChallengeResponse?.formData}
          redirectTo={searchParams.get("redirectTo")}
        />
      </Container>
      {/* Display a list of accomplishments that need to be validated */}
      {loaderData.accomplishmentResponse?.accomplishments && (
        <div style={{ marginTop: "50px" }}>
          <Typography textAlign="center" variant="h4">
            Pending Accomplishments
          </Typography>
          {generateAlert(
            "error",
            actionData?.validateAccomplishmentResponse?.error
          )}
          {generateAlert(
            "success",
            actionData?.validateAccomplishmentResponse?.success
          )}
          <AccomplishmentsGrid
            accomplishments={loaderData.accomplishmentResponse?.accomplishments}
            formData={{
              validateForm:
                actionData?.validateAccomplishmentResponse?.formData,
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
