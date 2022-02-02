import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";

import { Accomplishment } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";

import {
  createAccomplishment,
  getManyAccomplishment,
} from "~/services/accomplishment";
import { requireUserInfo } from "~/services/authentication";
import { getChallenge } from "~/services/challenges";

type LoaderData = {
  challenge?: Challenge;
  accomplishments?: Accomplishment[];
  userId: number;
  challengeId: number;
  accomplishlentInfo?: string;
};

type ActionData = {
  formError?: string;
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
  formSuccess?: string;
};

function badRequest(data: ActionData) {
  return json(data, 400);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  const userInfo = await requireUserInfo(
    request,
    `/challenge/${params.challengeId}`
  );

  const challenge = await getChallenge(request, parseInt(params.challengeId));

  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(request);
  } catch (err) {
    if (err instanceof Error) {
      return {
        challenge,
        userId: userInfo.userId,
        challengeId: params.challengeId,
        accomplishmentInfo: err.message,
      };
    }
    throw err;
  }

  return {
    challenge,
    accomplishments: accomplishments,
    userId: userInfo.userId,
    challengeId: parseInt(params.challengeId),
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 404);
  }

  await requireUserInfo(request, `/challenge/${params.challengeId}`);

  const form = await request.formData();
  const proof = form.get("proof");

  if (typeof proof !== "string") {
    return badRequest({ formError: "You must fill all fields" });
  }

  try {
    await createAccomplishment(
      request,
      {
        proof,
      },
      parseInt(params.challengeId)
    );
  } catch (err) {
    if (err instanceof Error) {
      return {
        formError: err.message,
      };
    }
    throw err;
  }

  return json({ formSuccess: "Accomplishment created" }, 201);
};

export default function Challenge() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Challenge</h1>
      <h2>{loaderData.challenge?.name}</h2>
      <p>
        <b>Reward : {loaderData.challenge?.reward}</b>
      </p>
      <p>{loaderData.challenge?.description}</p>
      <p>Created : {loaderData.challenge?.createdAt}</p>
      <h1>Submit accomplishment</h1>
      <form method="post">
        <p>{actionData?.formError || actionData?.formSuccess}</p>
        <div>
          <label htmlFor="proof-input">Proof</label>
          <input type="text" name="proof" id="proof-input" />
          <p>{actionData?.fieldsError?.proof}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <h1>Your accomplishments</h1>
        {loaderData.accomplishments
          ?.filter((accomplishment) => {
            return (
              accomplishment.userId === loaderData.userId &&
              accomplishment.challengeId === loaderData.challengeId
            );
          })
          .sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((accomplishment) => {
            return (
              <div>
                <p>{accomplishment.proof}</p>
                <p>Created : {accomplishment.createdAt}</p>
                <p>
                  <b>
                    {accomplishment.validation === 1
                      ? "Accepted"
                      : accomplishment.validation === -1
                      ? "Refused"
                      : "Pending"}
                  </b>
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
