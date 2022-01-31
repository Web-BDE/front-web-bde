import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { getUserId, requireUserId } from "~/services/authentication";
import {
  Accomplishment,
  Challenge,
  createAccomplishment,
  getChallenge,
  getManyAccomplishment,
} from "~/services/challenges";

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
  await requireUserId(request, `/challenge/${params.challengeId}`);

  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  const challenge = await getChallenge(request, parseInt(params.challengeId));

  const accomplishmentsResult = await getManyAccomplishment(request);

  if (accomplishmentsResult instanceof Error) {
    return {
      challenge,
      userId: await getUserId(request),
      challengeId: params.challengeId,
      accomplishmentInfo: accomplishmentsResult.message,
    };
  }

  return {
    challenge,
    accomplishments: accomplishmentsResult,
    userId: await getUserId(request),
    challengeId: parseInt(params.challengeId),
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const proof = form.get("proof");

  if (typeof proof !== "string") {
    return badRequest({ formError: "You must fill all the form" });
  }

  const fields = { proof };

  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  const accomplishmentResult = await createAccomplishment(
    request,
    proof,
    parseInt(params.challengeId)
  );

  if (accomplishmentResult instanceof Error) {
    return badRequest({ fields, formError: accomplishmentResult.message });
  }

  return json({ formSuccess: accomplishmentResult }, 201);
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
          .map((accomplishment) => {
            return (
              <div>
                <p>{accomplishment.proof}</p>
                <p>Created : {accomplishment.createdAt}</p>
                <p>
                  <b>
                    {accomplishment.validation === 1
                      ? "Acceptec"
                      : accomplishment.validation === -1
                      ? "Refused"
                      : ""}
                  </b>
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
