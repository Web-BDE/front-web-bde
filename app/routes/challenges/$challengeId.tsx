import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import Accomplishments from "~/components/accomplishments";

import { Accomplishment } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";
import { User } from "~/models/User";

import {
  createAccomplishment,
  deleteAccomplishment,
  getManyAccomplishment,
  updateAccomplishment,
} from "~/services/accomplishment";
import { requireUserInfo } from "~/services/authentication";
import {
  deleteChallenge,
  getChallenge,
  updateChallenge,
} from "~/services/challenges";
import { getSelft } from "~/services/user";
import { APIError } from "~/utils/axios";

type LoaderData = {
  challenge: Challenge;
  userId: number;
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
  updateChallenge?: {
    formError?: string;
    formSuccess?: string;
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
  deleteAccomplishment?: {
    formError?: string;
    formSuccess?: string;
  };
  deleteChallenge?: {
    formError?: string;
    formSuccess?: string;
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
    if (error instanceof APIError) {
      return {
        challenge,
        accomplishments: {
          error: error.error.message,
          userId: userInfo.userId,
          challengeId: challenge.id,
        },
      };
    }
    throw error;
  }

  return {
    challenge,
    userId: userInfo.userId,
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
  const accomplishmendId = form.get("accomplishmentId");

  console.log(method);

  switch (method) {
    case "create-accomplishment":
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
        if (err instanceof APIError) {
          return badRequest({
            creacteAccomplishment: { formError: err.error.message },
          });
        }
        throw err;
      }

      return json(
        { createAccomplishment: { formSuccess: "Accomplishment created" } },
        201
      );
    case "update-accomplishment":
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
        if (err instanceof APIError) {
          return badRequest({
            updateAccomplishment: { formError: err.error.message },
          });
        }
        throw err;
      }

      return json(
        { updateAccomplishment: { formSuccess: "Accomplishment updated" } },
        201
      );
    case "update-challenge":
      const name = form.get("name");
      const description = form.get("description");
      const reward = form.get("reward");

      //Check for undefined values
      if (
        typeof name !== "string" ||
        (typeof description !== "string" &&
          typeof description !== "undefined") ||
        typeof reward !== "string"
      ) {
        return badRequest({
          updateChallenge: { formError: "You must fill all the fields" },
        });
      }

      //Check fields format errors
      const fields = { name, description, reward: parseInt(reward) };
      const fieldsError = {
        reward: validateReward(parseInt(reward)),
      };

      if (Object.values(fieldsError).some(Boolean)) {
        return badRequest({ updateChallenge: { fields, fieldsError } });
      }

      //Try to update challenge
      try {
        await updateChallenge(request, fields, parseInt(params.challengeId));
      } catch (err) {
        //We don't want to throw API errors, we will show the in the form instead
        if (err instanceof APIError) {
          return badRequest({
            updateChallenge: { formError: err.error.message, fields },
          });
        }
      }

      return json(
        { updateChallenge: { formSuccess: "Challenge updated" } },
        201
      );
    case "delete-accomplishment":
      if (typeof accomplishmendId !== "string") {
        return badRequest({
          updateAccomplishment: { formError: "There was an error" },
        });
      }
      //Try to delete accomplishment
      try {
        await deleteAccomplishment(request, parseInt(accomplishmendId));
      } catch (err) {
        //We don't want to throw API errors, we will show the in the form instead
        if (err instanceof APIError) {
          return badRequest({
            deleteAccomplishment: { formError: err.error.message },
          });
        }
      }

      return json(
        { updateChallenge: { formSuccess: "Accomplishment deleted" } },
        201
      );
    case "delete-challenge":
      //Try to delete accomplishment
      try {
        await deleteChallenge(request, parseInt(params.challengeId));
      } catch (err) {
        //We don't want to throw API errors, we will show the in the form instead
        if (err instanceof APIError) {
          return badRequest({
            deleteChallenge: { formError: err.error.message },
          });
        }
      }

      return redirect("/challenges");
    default:
      throw new Error("There was an error during form handling");
  }
};

function displayChallenge(
  challenge: Challenge,
  userId: number,
  actionData?: ActionData
) {
  if (userId === challenge.creatorId) {
    return (
      <div>
        <form method="post">
          <p>
            {actionData?.updateChallenge?.formError ||
              actionData?.updateChallenge?.formSuccess}
          </p>
          <input type="hidden" name="method" value="update-challenge" />
          <div>
            <label htmlFor="name-input">Name</label>
            <input
              type="text"
              name="name"
              id="name-input"
              defaultValue={
                actionData?.updateChallenge?.fields?.name || challenge.name
              }
            />
            <p>{actionData?.updateChallenge?.fieldsError?.name}</p>
          </div>
          <div>
            <label htmlFor="reward-input">Reward</label>
            <input
              type="text"
              name="reward"
              id="reward-input"
              defaultValue={
                actionData?.updateChallenge?.fields?.reward || challenge.reward
              }
            />
            <p>{actionData?.updateChallenge?.fieldsError?.reward}</p>
          </div>
          <div>
            <label htmlFor="description-input">Description</label>
            <input
              type="text"
              name="description"
              id="description-input"
              defaultValue={
                actionData?.updateChallenge?.fields?.description ||
                challenge.description
              }
            />
            <p>{actionData?.updateChallenge?.fieldsError?.description}</p>
          </div>
          <p>Created : {challenge.createdAt}</p>
          <button type="submit">Update</button>
        </form>
        <form method="post">
          <input type="hidden" name="method" value="delete-challenge" />
          <button type="submit">Delete</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>{challenge.name}</h2>
        <p>
          <b>Reward : {challenge.reward}</b>
        </p>
        <p>{challenge.description}</p>
        <p>Created : {challenge.createdAt}</p>
      </div>
    );
  }
}

export default function Challenge() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="container">
      <h2>Challenge</h2>
      {displayChallenge(loaderData.challenge, loaderData.userId, actionData)}
      <h2>Submit accomplishment</h2>
      <form method="post">
        <p>
          {actionData?.creacteAccomplishment?.formError ||
            actionData?.creacteAccomplishment?.formSuccess}
        </p>
        <input type="hidden" name="method" value="create-accomplishment" />
        <div>
          <div>
            <label htmlFor="proof-input">Proof</label>
          </div>
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

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 401:
      return (
        <div className="container">
          <p>
            You must be <Link to="/login">logged in</Link> to see this data
          </p>
        </div>
      );
    case 403:
      return (
        <div className="container">
          <p>Sorry, you don't have the rights to see this</p>
        </div>
      );
    default:
      <div className="container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <p>{caught.data}</p>
      </div>;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
