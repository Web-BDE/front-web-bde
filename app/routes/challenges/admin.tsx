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
  useSearchParams,
  useTransition,
} from "remix";

import { requireAuth } from "~/services/authentication";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { CircularProgress, Container, Typography } from "@mui/material";
import AccomplishmentsGrid from "~/components/challenge/grids/accomplishmentGrid";
import CreateChallengeForm from "~/components/challenge/forms/createChallengeForm";
import {
  getManyAccomplishment,
  updateAccomplishment,
} from "~/services/accomplishment";
import { createChallenge, putChallengePicture } from "~/services/challenges";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
  Validation,
} from "~/models/Accomplishment";
import { CreateChallengeFormData } from "~/models/Challenge";
import AccomplishmentAdminList from "~/components/challenge/accomplishmentAdminList";
import { NodeOnDiskFile } from "@remix-run/node";
import { blue } from "@mui/material/colors";

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
  picture: Blob,
  description?: string
) {
  //Check fields format errors
  const fields = { name, description, reward, maxAtempts, picture };
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

  if (createChallengeResponse.error || !createChallengeResponse.challengeId) {
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

  const { code: UploadCode, ...uploadPictureResponse } =
    await putChallengePicture(
      token,
      createChallengeResponse.challengeId,
      picture
    );

  if (uploadPictureResponse.error) {
    return json(
      {
        createChallengeResponse: {
          ...uploadPictureResponse,
          formData: { fields, fieldsError },
        },
      } as ActionData,
      UploadCode
    );
  }

  return redirect("/challenges");
}

export const action: ActionFunction = async ({ request }) => {
  //User need to be logged in
  const token = await requireAuth(request, `/challenges/admin`);
  console.log("form");

  const uploadHandler = unstable_createFileUploadHandler({
    maxFileSize: 100_000_000,
    file: ({ filename }) => filename,
  });

  //Declare all fields
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  console.log(form);

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
      const picture = form.get("picture");

      //Check for undefined values
      if (
        typeof name !== "string" ||
        (typeof description !== "string" && description !== null) ||
        typeof reward !== "string" ||
        typeof maxAtempts !== "string" ||
        !(picture instanceof NodeOnDiskFile)
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
        picture,
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

  const transition = useTransition();

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
        <Container style={{ marginTop: "50px" }}>
          <Typography marginBottom={"50px"} textAlign="center" variant="h4">
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
          <AccomplishmentAdminList
            accomplishments={loaderData.accomplishmentResponse?.accomplishments}
          />
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
