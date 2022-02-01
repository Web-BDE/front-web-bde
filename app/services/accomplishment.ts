import axios from "axios";
import { Accomplishment } from "~/models/Accomplishment";
import { getToken } from "./authentication";

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
      { info: { proof: accomplishmentForm.proof }, challengeId: accomplishmentForm.challengeId },
      { headers: { Authorization: `Bearer ${await getToken(request)}` } }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }

  return "Accomplishment created";
}

export async function getManyAccomplishment(request: Request) {
  let accomplishments;
  try {
    accomplishments = await axios.get<Accomplishment[]>("/accomplishment", {
      headers: { Authorization: `Bearer ${await getToken(request)}` },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }
  return accomplishments.data;
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
      { headers: { Authorization: `Bearer ${await getToken(request)}` } }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }

  return true;
}
