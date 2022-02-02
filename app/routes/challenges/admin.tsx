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

type ActionData = {
  formError?: string;
  fieldsError?: {
    name?: string;
    description?: string;
    reward?: string;
  };
  fields?: {
    name: string;
    description: string;
    reward: number;
  };
  validationError?: string;
};

type LoaderData = {
  accomplishments?: Accomplishment[];
  accomplishmentInfo?: string;
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
  await requireUserInfo(request, `/challenges/admin`);

  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(request);
  } catch (err) {
    if (err instanceof Error) {
      return {
        accomplishmentInfo: err.message,
      };
    }
    throw err;
  }

  return {
    accomplishments: accomplishments,
  };
};

export const action: ActionFunction = async ({ request }) => {
  await requireUserInfo(request, `/challenges/admin`);

  const form = await request.formData();
  const redirectTo = form.get("redirectTo");

  if (typeof redirectTo !== "string") {
    return badRequest({ formError: "Invalid form data" });
  }

  if (form.has("validation")) {
    const validation = form.get("validation");
    const accomplishmentId = form.get("accomplishmentId");

    if (
      typeof validation !== "string" ||
      typeof accomplishmentId !== "string"
    ) {
      return badRequest({ validationError: "There was an error" });
    }

    const validationError = validateValidation(parseInt(validation));

    if (validationError) {
      return badRequest({ validationError: validationError });
    }

    try {
      await validateAccomplishment(
        request,
        validation === "1" ? 1 : -1,
        parseInt(accomplishmentId)
      );
    } catch (err) {
      if (err instanceof Error) {
        return badRequest({ validationError: err.message });
      }
      throw err;
    }
  } else {
    const name = form.get("name");
    const description = form.get("description");
    const reward = form.get("reward");

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof reward !== "string"
    ) {
      return badRequest({ formError: "You must fill all the fields" });
    }

    const fields = { name, description, reward: parseInt(reward) };
    const fieldsError = {
      reward: validateReward(parseInt(reward)),
    };

    if (Object.values(fieldsError).some(Boolean)) {
      return badRequest({ fields, fieldsError });
    }

    try {
      await createChallenge(request, fields);
    } catch (err) {
      if (err instanceof Error) {
        return badRequest({ formError: err.message, fields });
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
        <p>{actionData?.formError}</p>
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
            defaultValue={actionData?.fields?.name}
          />
          <p>{actionData?.fieldsError?.name}</p>
        </div>
        <div>
          <label htmlFor="description-input">Description</label>
          <input
            type="text"
            name="description"
            id="description-input"
            defaultValue={actionData?.fields?.description}
          />
          <p>{actionData?.fieldsError?.description}</p>
        </div>
        <div>
          <label htmlFor="reward-input">Reward</label>
          <input
            type="number"
            name="reward"
            id="reward-input"
            min="0"
            defaultValue={actionData?.fields?.reward || 0}
          />
          <p>{actionData?.fieldsError?.reward}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
      <h1>Accomplishments to validate</h1>
      <p>{loaderData.accomplishmentInfo}</p>
      <p>{actionData?.validationError}</p>
      {loaderData.accomplishments
        ?.filter((accomplishment) => {
          return !accomplishment.validation;
        })
        .sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        })
        .map((accomplishment) => {
          return (
            <div key={accomplishment.id}>
              <p>{accomplishment.proof}</p>
              <p>Created : {accomplishment.createdAt}</p>
              <form method="post">
                <input
                  type="hidden"
                  name="redirectTo"
                  value={"/challenges/admin"}
                />
                <input
                  type="hidden"
                  name="accomplishmentId"
                  value={accomplishment.id}
                />
                <button type="submit" name="validation" value="1">
                  Validate
                </button>
                <button type="submit" name="validation" value="-1">
                  Refuse
                </button>
              </form>
            </div>
          );
        })}
    </div>
  );
}
