import axios from "axios";
import { Goodies } from "~/models/Goodies";
import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type GoodiesInfo = {
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
  goodiesForm: GoodiesInfo
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

export async function updateGoodies(
  request: Request,
  goodiesInfo: GoodiesInfo,
  goodiesId: number
) {
  try {
    await axios.patch(`/goodies/${goodiesId}`, goodiesInfo, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Goodies updated";
}

export async function deleteGoodies(request: Request, goodiesId: number) {
  try {
    await axios.delete(`/goodies/${goodiesId}`, {
      headers: await buildAxiosHeaders(request),
    });
  } catch (err) {
    handleAPIError(err);
  }

  return "Goodies deleted";
}
