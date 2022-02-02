import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import Accomplishments from "~/components/accomplishments";

import { Accomplishment } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";

import {
  createAccomplishment,
  getManyAccomplishment,
  updateAccomplishment,
} from "~/services/accomplishment";
import { requireUserInfo } from "~/services/authentication";
import { getChallenge } from "~/services/challenges";

type LoaderData = {
  challenge?: Challenge;
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
  } catch (error) {
    if (error instanceof Error) {
      return {
        challenge,
        accomplishments: {
          error,
          userId: userInfo.userId,
          challengeId: challenge.id,
        },
      };
    }
    throw error;
  }

  return {
    challenge,
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

  const form = await request.formData();
  const proof = form.get("proof");
  const method = form.get("method");

  switch (method) {
    case "create":
      if (typeof proof !== "string") {
        return badRequest({
          creacteAccomplishment: { formError: "You must fill all fields" },
        });
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
          return badRequest({
            creacteAccomplishment: { formError: err.message },
          });
        }
        throw err;
      }

      return json(
        { createAccomplishment: { formSuccess: "Accomplishment created" } },
        201
      );
    case "update":
      const accomplishmendId = form.get("accomplishmentId");

      if (typeof accomplishmendId !== "string") {
        return badRequest({
          updateAccomplishment: { formError: "There was an error" },
        });
      }

      if (typeof proof !== "string") {
        return badRequest({
          updateAccomplishment: { formError: "You must fill all fields" },
        });
      }

      try {
        await updateAccomplishment(
          request,
          {
            proof,
          },
          parseInt(accomplishmendId)
        );
      } catch (err) {
        if (err instanceof Error) {
          return badRequest({
            updateAccomplishment: { formError: err.message },
          });
        }
        throw err;
      }

      return json(
        { updateAccomplishment: { formSuccess: "Accomplishment updated" } },
        201
      );
    default:
      throw new Error("There was an error during form handling");
  }
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
        <p>
          {actionData?.creacteAccomplishment?.formError ||
            actionData?.creacteAccomplishment?.formSuccess}
        </p>
        <input type="hidden" name="method" value="create" />
        <div>
          <label htmlFor="proof-input">Proof</label>
          <input type="text" name="proof" id="proof-input" />
          <p>{actionData?.creacteAccomplishment?.fieldsError?.proof}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
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
