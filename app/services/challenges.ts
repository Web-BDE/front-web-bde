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
    return new Error("Unable to find challenge");
  }

  return challenges.data;
}
