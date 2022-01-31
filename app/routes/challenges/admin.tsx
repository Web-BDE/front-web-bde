import {
  ActionFunction,
  json,
  redirect,
  useActionData,
  useSearchParams,
} from "remix";
import { requireUserId } from "~/services/authentication";
import { createChallenge } from "~/services/challenges";

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
};

function badRequest(data: ActionData) {
  return json(data, 400);
}

function validateReward(reward: number) {
  if (reward < 0) {
    return "Reward must be positive";
  }
}

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  const form = await request.formData();
  const name = form.get("name");
  const description = form.get("description");
  const reward = form.get("reward");
  const redirectTo = form.get("redirectTo");

  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof reward !== "string" ||
    typeof redirectTo !== "string"
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

  const challengeResult = await createChallenge(request, fields);

  if (challengeResult instanceof Error) {
    return badRequest({ formError: challengeResult.message, fields });
  }

  return redirect(redirectTo);
};

export default function ChallengesAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
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
    </div>
  );
}
