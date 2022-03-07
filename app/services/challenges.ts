import axios from "axios";
import { Challenge, ChallengeInfo } from "~/models/Challenge";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";

export async function getManyChallenge(
  token: string,
  limit?: number,
  offset?: number
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() }
  );
  try {
    const reply = await axios.get<{ message: string; challenges: Challenge[] }>(
      `/challenge/${
        searchParams.entries() ? "?" + searchParams.toString() : ""
      }`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      challenges: reply.data.challenges,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
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

    return {
      success: reply.data.message,
      code: reply.status,
      challenge: reply.data.challenge,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function createChallenge(
  token: string,
  challengeInfo: ChallengeInfo
) {
  try {
    const reply = await axios.put<{ message: string; challengeId: number }>(
      "/challenge",
      challengeInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      challengeId: reply.data.challengeId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function updateChallenge(
  token: string,
  challengeInfo: ChallengeInfo,
  challengeId: number
) {
  try {
    const reply = await axios.patch<{ message: string; challengeId: number }>(
      `/challenge/${challengeId}`,
      challengeInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      challengeId: reply.data.challengeId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function deleteChallenge(token: string, challengeId: number) {
  try {
    const reply = await axios.delete<{ message: string; challengeId: number }>(
      `/challenge/${challengeId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      challengeId: reply.data.challengeId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}
