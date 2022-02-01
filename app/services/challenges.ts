import axios from "axios";
import { Challenge } from "~/models/Challenge";
import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type ChallengeInfo = {
  name: string;
  description?: string;
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
  challengeInfo: ChallengeInfo
) {
  try {
    await axios.put("/challenge", challengeInfo, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Challenge created";
}

export async function updateChallenge(
  request: Request,
  challengeInfo: ChallengeInfo,
  challengeId: number
) {
  try {
    await axios.patch(`/challenge/${challengeId}`, challengeInfo, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Challenge updated";
}

export async function deleteChallenge(request: Request, challengeId: number) {
  try {
    await axios.delete(`/challenge/${challengeId}`, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Challenge deleted";
}
