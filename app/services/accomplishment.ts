import axios from "axios";

import { Accomplishment } from "~/models/Accomplishment";

import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type AccomplishmentInfo = {
  proof?: string;
};

export async function createAccomplishment(
  request: Request,
  accomplishmentInfo: AccomplishmentInfo,
  challengeId: number
) {
  try {
    await axios.put(
      "/accomplishment",
      {
        info: accomplishmentInfo,
        challengeId,
      },
      { headers: await buildAxiosHeaders(request) }
    );
  } catch (err) {
    handleAPIError(err);
  }

  return "Accomplishment created";
}

export async function updateAccomplishment(
  request: Request,
  accomplishmentInfo: AccomplishmentInfo,
  accomplishmentId: number
) {
  try {
    await axios.put(
      `/accomplishment/${accomplishmentId}`,
      {
        info: accomplishmentInfo,
      },
      { headers: await buildAxiosHeaders(request) }
    );
  } catch (err) {
    handleAPIError(err);
  }

  return "Accomplishment updated";
}

export async function deleteAccomplishment(
  request: Request,
  accomplishmentId: number
) {
  try {
    await axios.delete(`/accomplishment/${accomplishmentId}`, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Accomplishment deleted";
}

export async function getAccomplishment(
  request: Request,
  accomplishmentId: number
) {
  let accomplishment;
  try {
    accomplishment = (
      await axios.get<{ message: string; accomplishments: Accomplishment[] }>(
        `/accomplishment/${accomplishmentId}`,
        {
          headers: await buildAxiosHeaders(request),
        }
      )
    ).data.accomplishments;
  } catch (err) {
    handleAPIError(err);
  }
  return accomplishment;
}

export async function getManyAccomplishment(request: Request) {
  let accomplishments;
  try {
    accomplishments = (
      await axios.get<{ message: string; accomplishments: Accomplishment[] }>(
        "/accomplishment",
        {
          headers: await buildAxiosHeaders(request),
        }
      )
    ).data.accomplishments;
  } catch (err) {
    handleAPIError(err);
  }
  return accomplishments;
}

export async function validateAccomplishment(
  request: Request,
  validation: 1 | -1,
  accomplishmentId: number
) {
  try {
    await axios.patch(
      `/accomplishment/validate/${accomplishmentId}`,
      { state: validation },
      { headers: await buildAxiosHeaders(request) }
    );
  } catch (err) {
    handleAPIError(err);
  }

  return "Accomplishment validation changed";
}
