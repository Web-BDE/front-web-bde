import axios from "axios";
import { Goodies, GoodiesInfo } from "~/models/Goodies";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";

export async function getManyGoodies(
  token: string,
  limit?: number,
  offset?: number
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() }
  );
  try {
    const reply = await axios.get<{ message: string; goodies: Goodies[] }>(
      `/goodies/${searchParams.entries() ? "?" + searchParams.toString() : ""}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      goodies: reply.data.goodies,
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

export async function getGoodies(token: string, goodiesId: number) {
  try {
    const reply = await axios.get<{ message: string; goodies: Goodies }>(
      `/goodies/${goodiesId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      goodies: reply.data.goodies,
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

export async function createGoodies(token: string, goodiesInfo: GoodiesInfo) {
  try {
    const reply = await axios.put<{ message: string }>(
      "/goodies",
      goodiesInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return { success: reply.data.message, code: reply.status };
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

export async function updateGoodies(
  token: string,
  goodiesInfo: GoodiesInfo,
  goodiesId: number
) {
  try {
    const reply = await axios.patch<{ message: string }>(
      `/goodies/${goodiesId}`,
      goodiesInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return { success: reply.data.message, code: reply.status };
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

export async function deleteGoodies(token: string, goodiesId: number) {
  try {
    const reply = await axios.delete<{ message: string }>(
      `/goodies/${goodiesId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return { success: reply.data.message, code: reply.status };
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
