import axios from "axios";
import { Challenge } from "~/models/Challenge";
import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type ChallengeForm = {
  name: string;
  description: string;
  reward: number;
};

export async function getManyChallenge(request: Request) {
  let challenges;
  try {
    challenges = (
      await axios.get<{ message: string; challenges: Challenge[] }>(
        "/challenge",
        {
          headers: await buildAxiosHeaders(request),
        }
      )
    ).data.challenges;
  } catch (err) {
    handleAPIError(err);
  }

  if (!challenges) {
    throw new Error("Unable to find any challenge");
  }

  return challenges;
}

export async function getChallenge(request: Request, challengeId: number) {
  let challenge;
  try {
    challenge = (
      await axios.get<{ message: string; challenge: Challenge }>(
        `/challenge/${challengeId}`,
        {
          headers: await buildAxiosHeaders(request),
        }
      )
    ).data.challenge;
  } catch (err) {
    handleAPIError(err);
  }

  if (!challenge) {
    throw new Error("Unable to find challenge");
  }

  return challenge;
}

export async function createChallenge(
  request: Request,
  challengeForm: ChallengeForm
) {
  try {
    await axios.put("/challenge", challengeForm, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Challenge created";
}
