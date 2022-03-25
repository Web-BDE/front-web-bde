import axios from "axios";
import FormData from "form-data";

import {
  Accomplishment,
  AccomplishmentInfo,
  Validation,
} from "~/models/Accomplishment";

import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";

export async function createAccomplishment(
  token: string,
  accomplishmentInfo: AccomplishmentInfo,
  challengeId: number
) {
  const searchParams = buildSearchParams({
    key: "challengeId",
    val: challengeId.toString(),
  });
  try {
    const reply = await axios.put<{
      message: string;
      accomplishmentId: number;
    }>(
      `/accomplishment${searchParams}`,
      { comment: accomplishmentInfo.comment },
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      accomplishmentId: reply.data.accomplishmentId,
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

export async function updateAccomplishment(
  token: string,
  accomplishmentId: number,
  comment?: string,
  validation?: Validation,
  refusedComment?: string
) {
  try {
    const reply = await axios.patch<{
      message: string;
      accomplishmentId: number;
    }>(
      `/accomplishment/${accomplishmentId}`,
      { comment, status: validation, refusedComment },
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      accomplishmentId: reply.data.accomplishmentId,
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

export async function deleteAccomplishment(
  token: string,
  accomplishmentId: number
) {
  try {
    const reply = await axios.delete<{
      message: string;
      accomplishmentId: number;
    }>(`/accomplishment/${accomplishmentId}`, {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      accomplishmentId: reply.data.accomplishmentId,
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

export async function getAccomplishment(
  token: string,
  accomplishmentId: number
) {
  try {
    const reply = await axios.get<{
      message: string;
      accomplishment: Accomplishment;
    }>(`/accomplishment/${accomplishmentId}`, {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      accomplishment: reply.data.accomplishment,
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

export async function getManyAccomplishment(
  token: string,
  limit?: number,
  offset?: number,
  challengeId?: number,
  userId?: number,
  validation?: Validation
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() },
    { key: "challengeId", val: challengeId?.toString() },
    { key: "userId", val: userId?.toString() },
    { key: "status", val: validation }
  );
  try {
    const reply = await axios.get<{
      message: string;
      accomplishments: Accomplishment[];
    }>(`/accomplishment${searchParams}`, {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      accomplishments: reply.data.accomplishments,
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

export async function putProof(
  token: string,
  accomplishmentId: number,
  proof: Blob
) {
  const searchParams = buildSearchParams({
    key: "accomplishmentId",
    val: accomplishmentId.toString(),
  });
  try {
    const formData = new FormData();
    formData.append("proof", Buffer.from(await proof.arrayBuffer()));

    const multipartHeaders = formData.getHeaders();

    const reply = await axios.put<{
      message: string;
      accomplishment: Accomplishment;
    }>(`/accomplishment/proof${searchParams}`, formData, {
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

export async function getProof(token: string, accomplishmentId: number) {
  const searchParams = buildSearchParams({
    key: "accomplishmentId",
    val: accomplishmentId.toString(),
  });
  try {
    const reply = await axios.get<{ message: string; proof: Buffer }>(
      `/accomplishment/proof${searchParams}`,
      { headers: buildAxiosHeaders(token) }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      proof: reply.data.proof,
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

export async function deleteProof(token: string, accomplishmentId: number) {
  const searchParams = buildSearchParams({
    key: "accomplishmentId",
    val: accomplishmentId.toString(),
  });
  try {
    const reply = await axios.delete<{ message: string }>(
      `/accomplishment/proof${searchParams}`,
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

export async function getAccomplishmentCount(
  token: string,
  challengeId?: number,
  userId?: number,
  validation?: Validation
) {
  const searchParams = buildSearchParams(
    { key: "challengeId", val: challengeId?.toString() },
    { key: "userId", val: userId?.toString() },
    { key: "status", val: validation }
  );
  try {
    const reply = await axios.get<{
      message: string;
      count: number;
    }>(`/accomplishment/count${searchParams}`, {
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