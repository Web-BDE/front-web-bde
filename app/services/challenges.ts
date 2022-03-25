import axios from "axios";
import { Challenge, ChallengeInfo } from "~/models/Challenge";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";
import FormData from "form-data";

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
      `/challenge/${searchParams}`,
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function putChallengePicture(
  token: string,
  challengeId: number,
  challengePicture: Blob
) {
  const searchParams = buildSearchParams({
    key: "challengeId",
    val: challengeId.toString(),
  });
  try {
    const formData = new FormData();
    formData.append(
      "challengePicture",
      Buffer.from(await challengePicture.arrayBuffer())
    );

    const multipartHeaders = formData.getHeaders();

    const reply = await axios.put<{
      message: string;
      challenge: Challenge;
    }>(`/challenge/picture${searchParams}`, formData, {
      headers: {
        ...buildAxiosHeaders(token),
        ...multipartHeaders,
      },
      maxBodyLength: 100_000_000,
    });

    return {
      success: reply.data.message,
      code: reply.status,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      if (err.response.data.message.includes("request file too large")) {
        return {
          error:
            "Fichier trop volumineux, veuiller envoyer un fichier plus léger",
        };
      }
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function getChallengePicture(token: string, challengeId: number) {
  const searchParams = buildSearchParams({
    key: "challengeId",
    val: challengeId.toString(),
  });
  try {
    const reply = await axios.get<{
      message: string;
      challengePicture: Buffer;
    }>(`/challenge/picture${searchParams}`, {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      challengePicture: reply.data.challengePicture,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function deleteChallengePicture(
  token: string,
  challengeId: number
) {
  const searchParams = buildSearchParams({
    key: "challengeId",
    val: challengeId.toString(),
  });
  try {
    const reply = await axios.delete<{ message: string }>(
      `/challenge/picture${searchParams}`,
      { headers: buildAxiosHeaders(token) }
    );

    return {
      success: reply.data.message,
      code: reply.status,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function getChallengeCount(
  token: string,
) {
  try {
    const reply = await axios.get<{
      message: string;
      count: number;
    }>("/challenge/count", {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      count: reply.data.count,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}