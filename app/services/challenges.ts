import axios from "axios";
import { json } from "remix";
import { getToken } from "./authentication";

export type Challenge = {
  id: number;
  name: string;
  description: string;
  reward: number;
  createdAt: Date;
  creatorId: number;
};

export async function getManyChallenge(request: Request) {
  let challenges;
  try {
    challenges = await axios.get<Challenge[]>("/challenge", {
      headers: { Authorization: `Bearer ${await getToken(request)}` },
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      throw json(
        `${err.response?.data?.message}`,
        err.response?.data?.statusCode
      );
    }
    throw err;
  }

  if (!challenges) {
    throw json("Unable to find any challenge", 404);
  }

  return challenges.data;
}

export async function getChallenge(request: Request, challengeId: number) {
  let challenge;
  try {
    challenge = await axios.get<Challenge>(`/challenge/${challengeId}`, {
      headers: { Authorization: `Bearer ${await getToken(request)}` },
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      throw json(
        `${err.response?.data?.message}`,
        err.response?.data?.statusCode
      );
    }
    throw err;
  }

  if (!challenge) {
    throw json("Unable to find challenge", 404);
  }

  return challenge.data;
}

export async function createAccomplishment(
  request: Request,
  proof: string,
  challengeId: number
) {
  try {
    await axios.put(
      "/accomplishment",
      { info: { proof }, challengeId },
      { headers: { Authorization: `Bearer ${await getToken(request)}` } }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }

  return "Accomplishment created";
}