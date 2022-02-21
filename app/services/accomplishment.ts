import axios from "axios";

import { Accomplishment } from "~/models/Accomplishment";

import {
  buildAxiosHeaders,
  buildSearchParams,
  handleAPIError,
} from "~/utils/axios";

type AccomplishmentInfo = {
  proof?: string;
};

export async function createAccomplishment(
  token: string,
  accomplishmentInfo: AccomplishmentInfo,
  challengeId: number
) {
  try {
    const reply = await axios.put<{ message: string }>(
      "/accomplishment",
      { info: accomplishmentInfo, challengeId },
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function updateAccomplishment(
  token: string,
  accomplishmentId: number,
  accomplishmentInfo?: AccomplishmentInfo,
  validation?: -1 | null | 1
) {
  try {
    const reply = await axios.put<{ message: string }>(
      `/accomplishment/${accomplishmentId}`,
      { info: accomplishmentInfo, status: validation },
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function deleteAccomplishment(
  token: string,
  accomplishmentId: number
) {
  try {
    const reply = await axios.delete<{ message: string }>(
      `/accomplishment/${accomplishmentId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
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

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function getManyAccomplishment(
  token: string,
  limit: number,
  offset: number,
  challengeId: number,
  userId: number
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() },
    { key: "challengeId", val: challengeId?.toString() },
    { key: "userId", val: userId?.toString() }
  );
  try {
    const reply = await axios.get<{
      message: string;
      accomplishments: Accomplishment[];
    }>(`/accomplishment/${searchParams.entries.length ? "?" + searchParams : ""}`, {
      headers: buildAxiosHeaders(token),
    });

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}
