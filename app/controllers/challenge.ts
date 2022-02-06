import { json, redirect } from "remix";
import {
  createChallenge,
  deleteChallenge,
  getManyChallenge,
  updateChallenge,
} from "~/services/challenges";
import { APIError } from "~/utils/axios";

//Validator for field reward
function validateReward(reward: number) {
  if (reward < 0) {
    return "Reward must be positive";
  }
}

export async function loadChallenges(request: Request) {
  //Get challenges, if it throw an error we will cath it with Boundaries below
  let challenges;
  try {
    challenges = await getManyChallenge(request);
  } catch (err) {
    if (err instanceof APIError) {
      throw json(err.error.message, err.code);
    }
    throw err;
  }
  return { challenges };
}

export async function handleChallengeCreation(
  request: Request,
  name: string,
  reward: number,
  redirectTo: string,
  description?: string,
) {
  //Check fields format errors
  const fields = { name, description, reward: reward };
  const fieldsError = {
    reward: validateReward(reward),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ createChallenge: { fields, fieldsError } }, 400);
  }

  //Try to create challenge
  try {
    await createChallenge(request, fields);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          createChallenge: { formError: err.error.message, fields },
        },
        err.code
      );
    }
  }

  return redirect(redirectTo);
}

export async function handleChallengeUpdate(
  request: Request,
  name: string,
  description: string,
  reward: number,
  challengeId: number
) {
  //Check fields format errors
  const fields = { name, description, reward: reward };
  const fieldsError = {
    reward: validateReward(reward),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ updateChallenge: { fields, fieldsError } }, 400);
  }

  //Try to update challenge
  try {
    await updateChallenge(request, fields, challengeId);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          updateChallenge: { formError: err.error.message, fields },
        },
        err.code
      );
    }
  }

  return json({ updateChallenge: { formSuccess: "Challenge updated" } }, 201);
}

export async function handleDeleteChallenge(
  request: Request,
  challengeId: number
) {
  //Try to delete accomplishment
  try {
    await deleteChallenge(request, challengeId);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          deleteChallenge: { formError: err.error.message },
        },
        err.code
      );
    }
  }
}
