import axios from "axios";

import { Accomplishment } from "~/models/Accomplishment";

import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type AccomplishmentForm = {
  proof: string;
  challengeId: number;
};

export async function createAccomplishment(
  request: Request,
  accomplishmentForm: AccomplishmentForm
) {
  try {
    await axios.put(
      "/accomplishment",
      {
        info: { proof: accomplishmentForm.proof },
        challengeId: accomplishmentForm.challengeId,
      },
      { headers: await buildAxiosHeaders(request) }
    );
  } catch (err) {
    handleAPIError(err);
  }

  return "Accomplishment created";
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
