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

export type Accomplishment = {
  id: number;
  userId: number;
  challengeId: number;
  createdAt: Date;
  proof: string;
  validation: 1 | -1 | null;
};

type ChallengeForm = {
  name: string;
  description: string;
  reward: number;
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

export async function createChallenge(
  request: Request,
  challengeForm: ChallengeForm
) {
  try {
    await axios.put("/challenge", challengeForm, {
      headers: { Authorization: `Bearer ${await getToken(request)}` },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }
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

export async function getManyAccomplishment(request: Request) {
  let accomplishments;
  try {
    accomplishments = await axios.get<Accomplishment[]>("/accomplishment", {
      headers: { Authorization: `Bearer ${await getToken(request)}` },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }
  return accomplishments.data;
}
