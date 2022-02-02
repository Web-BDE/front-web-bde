import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "remix";

import { Accomplishment } from "~/models/Accomplishment";
import { requireUserInfo } from "~/services/authentication";
import { createChallenge } from "~/services/challenges";

import {
  getManyAccomplishment,
  validateAccomplishment,
} from "~/services/accomplishment";

import AccomplishmentsAdmin from "~/components/accomplishmentsAdmin";

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

function badRequest(data: ActionData) {
  return json(data, 400);
}

function validateReward(reward: number) {
  if (reward < 0) {
    return "Reward must be positive";
  }
}

function validateValidation(validation: number) {
  if (validation !== -1 && validation !== 1) {
    return "Validation has invalid value";
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  //User need to be logged in
  await requireUserInfo(request, `/challenges/admin`);

  //Try to get accomplishments
  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(request);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the component instead
    if (err instanceof Error) {
      return {
        accomplishmenError: err.message,
      };
    }
    throw err;
  }

  return {
    accomplishments: accomplishments,
  };
};

export const action: ActionFunction = async ({ request }) => {
  //User need to be logged in
  await requireUserInfo(request, `/challenges/admin`);

  const form = await request.formData();
  const redirectTo = form.get("redirectTo");

  //Redirection undefined, should never happend
  if (typeof redirectTo !== "string") {
    return badRequest({ createChallenge: { formError: "Invalid form data" } });
  }

  //Validation request
  if (form.has("validation")) {
    const validation = form.get("validation");
    const accomplishmentId = form.get("accomplishmentId");

    //Should never happend
    if (
      typeof validation !== "string" ||
      typeof accomplishmentId !== "string"
    ) {
      return badRequest({
        validateChallenge: { validationError: "There was an error" },
      });
    }

    //Check for an error in the validation format
    const validationError = validateValidation(parseInt(validation));

    if (validationError) {
      return badRequest({
        validateChallenge: { validationError: validationError },
      });
    }

    //Try to validate challenge
    try {
      await validateAccomplishment(
        request,
        validation === "1" ? 1 : -1,
        parseInt(accomplishmentId)
      );
    } catch (err) {
      //We don't want to throw API errors, we will show the in the form instead
      if (err instanceof Error) {
        return badRequest({
          validateChallenge: { validationError: err.message },
        });
      }
      throw err;
    }
    //Challenge creation request
  } else {
    const name = form.get("name");
    const description = form.get("description");
    const reward = form.get("reward");

    //Check for undefined values
    if (
      typeof name !== "string" ||
      (typeof description !== "string" && typeof description !== "undefined") ||
      typeof reward !== "string"
    ) {
      return badRequest({
        createChallenge: { formError: "You must fill all the fields" },
      });
    }

    //Check fields format errors
    const fields = { name, description, reward: parseInt(reward) };
    const fieldsError = {
      reward: validateReward(parseInt(reward)),
    };

    if (Object.values(fieldsError).some(Boolean)) {
      return badRequest({ createChallenge: { fields, fieldsError } });
    }

    //Try to create challenge
    try {
      await createChallenge(request, fields);
    } catch (err) {
      //We don't want to throw API errors, we will show the in the form instead
      if (err instanceof Error) {
        return badRequest({
          createChallenge: { formError: err.message, fields },
        });
      }
    }
  }

  return redirect(redirectTo);
};

export default function ChallengesAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<LoaderData>();
  
  return (
    <div>
      <h1>Challenges Admin</h1>
      <form method="post">
        <p>{actionData?.createChallenge?.formError}</p>
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") || "/challenges"}
        />
        <div>
          <label htmlFor="name-input">Name</label>
          <input
            type="text"
            name="name"
            id="name-input"
            defaultValue={actionData?.createChallenge?.fields?.name}
          />
          <p>{actionData?.createChallenge?.fieldsError?.name}</p>
        </div>
        <div>
          <label htmlFor="description-input">Description</label>
          <input
            type="text"
            name="description"
            id="description-input"
            defaultValue={actionData?.createChallenge?.fields?.description}
          />
          <p>{actionData?.createChallenge?.fieldsError?.description}</p>
        </div>
        <div>
          <label htmlFor="reward-input">Reward</label>
          <input
            type="number"
            name="reward"
            id="reward-input"
            min="0"
            defaultValue={actionData?.createChallenge?.fields?.reward || 0}
          />
          <p>{actionData?.createChallenge?.fieldsError?.reward}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
      <AccomplishmentsAdmin loaderData={loaderData} actionData={actionData} />
    </div>
  );
}
