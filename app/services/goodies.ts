import axios from "axios";
import { Goodies } from "~/models/Goodies";
import {
  buildAxiosHeaders,
  buildSearchParams,
  handleAPIError,
} from "~/utils/axios";

type GoodiesInfo = {
  name: string;
  description?: string;
  price: number;
  buyLimit: number;
};

export async function getManyGoodies(
  token: string,
  limit: string,
  offset: string
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() }
  );
  try {
    const reply = await axios.get<{ message: string; goodies: Goodies[] }>(
      `/goodies/${searchParams.entries.length ? "?" + searchParams : ""}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
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

    return reply.data;
  } catch (err) {
    handleAPIError(err);
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

    return reply.data;
  } catch (err) {
    handleAPIError(err);
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

    return reply.data;
  } catch (err) {
    handleAPIError(err);
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

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}
