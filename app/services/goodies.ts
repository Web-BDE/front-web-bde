import axios from "axios";
import { Goodies, GoodiesInfo } from "~/models/Goodies";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";
import FormData from "form-data";

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
      `/goodies${searchParams}`,
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function createGoodies(token: string, goodiesInfo: GoodiesInfo) {
  try {
    const reply = await axios.put<{ message: string; goodiesId: number }>(
      "/goodies",
      goodiesInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      goodiesId: reply.data.goodiesId,
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

export async function updateGoodies(
  token: string,
  goodiesInfo: GoodiesInfo,
  goodiesId: number
) {
  try {
    const reply = await axios.patch<{ message: string; goodiesId: number }>(
      `/goodies/${goodiesId}`,
      goodiesInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      goodiesId: reply.data.goodiesId,
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

export async function deleteGoodies(token: string, goodiesId: number) {
  try {
    const reply = await axios.delete<{ message: string; goodiesId: number }>(
      `/goodies/${goodiesId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      goodiesId: reply.data.goodiesId,
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

export async function putGoodiesPicture(
  token: string,
  goodiesId: number,
  goodiesPicture: Blob
) {
  const searchParams = buildSearchParams({
    key: "goodiesId",
    val: goodiesId.toString(),
  });
  try {
    const formData = new FormData();
    formData.append(
      "goodiesPicture",
      Buffer.from(await goodiesPicture.arrayBuffer())
    );

    const multipartHeaders = formData.getHeaders();

    const reply = await axios.put<{
      message: string;
      goodies: Goodies;
    }>(`/goodies/picture${searchParams}`, formData, {
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
        return { error: "Fichier trop volumineux, veuiller envoyer un fichier plus léger" }
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

export async function getGoodiesPicture(token: string, goodiesId: number) {
  const searchParams = buildSearchParams({
    key: "goodiesId",
    val: goodiesId.toString(),
  });
  try {
    const reply = await axios.get<{ message: string; goodiesPicture: Buffer }>(
      `/goodies/picture${searchParams}`,
      { headers: buildAxiosHeaders(token) }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      goodiesPicture: reply.data.goodiesPicture,
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

export async function deleteGoodiesPicture(token: string, goodiesId: number) {
  const searchParams = buildSearchParams({
    key: "goodiesId",
    val: goodiesId.toString(),
  });
  try {
    const reply = await axios.delete<{ message: string }>(
      `/goodies/picture${searchParams}`,
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

export async function getGoodiesCount(
  token: string,
) {
  try {
    const reply = await axios.get<{
      message: string;
      count: number;
    }>("/goodies/count", {
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