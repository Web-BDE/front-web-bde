import axios from "axios";
import { Challenge } from "~/models/Challenge";
import {
  buildAxiosHeaders,
  buildSearchParams,
  handleAPIError,
} from "~/utils/axios";

type ChallengeInfo = {
  name: string;
  description?: string;
  reward?: number;
};

export async function getManyChallenge(
  token: string,
  limit?: number,
  offset?: number
) {
  const searchParams = buildSearchParams(limit?.toString(), offset?.toString());
  try {
    const reply = await axios.get<{ message: string; challenges: Challenge[] }>(
      `/challenge/${searchParams}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function getChallenge(token: string, challengeId: number) {
  try {
    const reply = await axios.get<{ message: string; challenge: Challenge }>(
      `/challenge/${challengeId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function createChallenge(
  token: string,
  challengeInfo: ChallengeInfo
) {
  try {
    const reply = await axios.put<{ message: string }>(
      "/challenge",
      challengeInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function updateChallenge(
  token: string,
  challengeInfo: ChallengeInfo,
  challengeId: number
) {
  try {
    const reply = await axios.patch<{ message: string }>(
      `/challenge/${challengeId}`,
      challengeInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function deleteChallenge(token: string, challengeId: number) {
  try {
    const reply = await axios.delete<{ message: string }>(
      `/challenge/${challengeId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}
