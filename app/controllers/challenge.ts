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

export async function handleChallengeCreation(
  token: string,
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
    await createChallenge(token, fields);
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
