import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import Accomplishments from "~/components/accomplishments";
import {
  handleAccomplishmentCreation,
  handleAccomplishmentUpdate,
  handleDeleteAccomplishment,
} from "~/controllers/accomplishment";
import {
  handleChallengeUpdate,
  handleDeleteChallenge,
} from "~/controllers/challenge";

import { Accomplishment } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";

import { getManyAccomplishment } from "~/services/accomplishment";
import { requireUserInfo } from "~/services/authentication";
import { getChallenge } from "~/services/challenges";
import { APIError } from "~/utils/axios";

import {
  generateUnexpectedError,
  generateExpectedError,
} from "../../controllers/error";

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

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.challengeId) {
    throw json("Invalid challenge query", 400);
  }

  //Need to provide userId to filter in jsx
  const userInfo = await requireUserInfo(
    request,
    `/challenge/${params.challengeId}`
  );

  const challenge = await getChallenge(request, parseInt(params.challengeId));

  //Get Accomplishments, we don't throw API Errors because we will display them
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

  //Decalare all fields
  const form = await request.formData();
  const method = form.get("method");
  //Accomplishment creation
  const proof = form.get("proof");
  //Accomplishment update
  const accomplishmentId = form.get("accomplishmentId");
  //Challenge update
  const name = form.get("name");
  const description = form.get("description");
  const reward = form.get("reward");

  switch (method) {
    case "create-accomplishment":
      if (typeof proof !== "string") {
        return json(
          {
            creacteAccomplishment: { formError: "You must fill all fields" },
          },
          400
        );
      }

      return await handleAccomplishmentCreation(
        request,
        proof,
        parseInt(params.challengeId)
      );
    case "update-accomplishment":
      if (typeof accomplishmentId !== "string") {
        return json(
          {
            updateAccomplishment: {
              formError: "There was an error, Please try again",
            },
          },
          400
        );
      }

      if (typeof proof !== "string") {
        return json(
          {
            updateAccomplishment: { formError: "You must fill all fields" },
          },
          400
        );
      }

      return await handleAccomplishmentUpdate(
        request,
        proof,
        parseInt(accomplishmentId)
      );
    case "update-challenge":
      if (
        typeof name !== "string" ||
        (typeof description !== "string" &&
          typeof description !== "undefined") ||
        typeof reward !== "string"
      ) {
        return json(
          {
            updateChallenge: { formError: "You must fill all the fields" },
          },
          400
        );
      }

      return await handleChallengeUpdate(
        request,
        name,
        description,
        parseInt(reward),
        parseInt(params.challengeId)
      );
    case "delete-accomplishment":
      if (typeof accomplishmentId !== "string") {
        return json(
          {
            updateAccomplishment: { formError: "There was an error" },
          },
          400
        );
      }

      return await handleDeleteAccomplishment(
        request,
        parseInt(accomplishmentId)
      );
    case "delete-challenge":
      await handleDeleteChallenge(request, parseInt(params.challengeId));

      return redirect("/challenges");
    default:
      throw new Error("There was an error during form handling");
  }
};

//If challenge creator is self transform normal inputs into a form to update it
function displayChallenge(
  challenge: Challenge,
  userId: number,
  actionData?: ActionData
) {
  if (userId === challenge.creatorId) {
    return (
      <div>
        <form method="post">
          <span>
            {actionData?.updateChallenge?.formError ||
              actionData?.updateChallenge?.formSuccess}
          </span>
          {/* Hiddent input to handle form method used */}
          <input type="hidden" name="method" value="update-challenge" />
          {/* Name input */}
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
            <span>{actionData?.updateChallenge?.fieldsError?.name}</span>
          </div>
          {/* Reward input */}
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
            <span>{actionData?.updateChallenge?.fieldsError?.reward}</span>
          </div>
          {/* Description input */}
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
            <span>{actionData?.updateChallenge?.fieldsError?.description}</span>
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
        <span>
          {actionData?.creacteAccomplishment?.formError ||
            actionData?.creacteAccomplishment?.formSuccess}
        </span>
        {/* Hiddend input for method */}
        <input type="hidden" name="method" value="create-accomplishment" />
        {/* Proof input */}
        <div>
          <div>
            <label htmlFor="proof-input">Proof</label>
          </div>
          <input type="text" name="proof" id="proof-input" />
          <span>{actionData?.creacteAccomplishment?.fieldsError?.proof}</span>
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* Display all user's accomplishment for this challenge */}
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
  generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  generateUnexpectedError(error);
}
