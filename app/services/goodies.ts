import axios from "axios";
import { Goodies } from "~/models/Goodies";
import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type GoodiesForm = {
  name: string;
  description: string;
  price: number;
  buyLimit: number;
};

export async function getManyGoodies(request: Request) {
  let goodies;
  try {
    goodies = (
      await axios.get<{ message: string; goodies: Goodies[] }>("/goodies", {
        headers: await buildAxiosHeaders(request),
      })
    ).data.goodies;
  } catch (err) {
    handleAPIError(err);
  }

  if (!goodies) {
    throw new Error("Unable to find any goodies");
  }

  return goodies;
}

export async function getGoodies(request: Request, goodiesId: number) {
  let goodies;
  try {
    goodies = (
      await axios.get<{ message: string; goodies: Goodies }>(
        `/goodies/${goodiesId}`,
        {
          headers: await buildAxiosHeaders(request),
        }
      )
    ).data.goodies;
  } catch (err) {
    handleAPIError(err);
  }

  if (!goodies) {
    throw new Error("Unable to find goodies");
  }

  return goodies;
}

export async function createGoodies(
  request: Request,
  goodiesForm: GoodiesForm
) {
  try {
    await axios.put("/goodies", goodiesForm, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Goodies created";
}
