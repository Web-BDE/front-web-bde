import axios from "axios";
import { Purchase } from "~/models/Purchase";

import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";

type PurchaseInfo = {
  goodiesId: number;
};

export async function createPurchase(
  token: string,
  purchaseInfo: PurchaseInfo
) {
  const searchParams = buildSearchParams({
    key: "goodiesId",
    val: purchaseInfo.goodiesId.toString(),
  });
  try {
    const reply = await axios.put<{ message: string; purchaseId: number }>(
      `/purchase${searchParams}`,
      purchaseInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      purchaseId: reply.data.purchaseId,
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

export async function deletePurchase(token: string, purchaseId: number) {
  try {
    const reply = await axios.delete<{ message: string; purchaseId: number }>(
      `/purchase/${purchaseId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      purchaseId: reply.data.purchaseId,
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

export async function UpdatePurchase(
  token: string,
  purchaseId: number,
  delivered: boolean
) {
  console.log(delivered);
  try {
    const reply = await axios.patch<{ message: string; purchaseId: number }>(
      `/purchase/${purchaseId}`,
      { delivered },
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      purchaseId: reply.data.purchaseId,
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

export async function getManyPurchase(
  token: string,
  limit?: number,
  offset?: number,
  goodiesId?: number,
  userId?: number,
  delivered?: boolean
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() },
    { key: "goodiesId", val: goodiesId?.toString() },
    { key: "userId", val: userId?.toString() },
    { key: "delivered", val: delivered?.toString() }
  );
  try {
    const reply = await axios.get<{ message: string; purchases: Purchase[] }>(
      `/purchase/${searchParams}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      purchases: reply.data.purchases,
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

export async function getPurchase(token: string, purchaseId: number) {
  try {
    const reply = await axios.get<{ message: string; purchase: Purchase }>(
      `/purchase/${purchaseId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      purchase: reply.data.purchase,
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
