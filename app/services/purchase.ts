import axios from "axios";
import { Goodies } from "~/models/Goodies";
import { Purchase } from "~/models/Purchase";

import {
  buildAxiosHeaders,
  buildSearchParams,
  handleAPIError,
} from "~/utils/axios";

type PurchaseInfo = {
  goodiesId: number;
};

export async function createPurchase(
  token: string,
  purchaseInfo: PurchaseInfo
) {
  try {
    const reply = await axios.put<{ message: string }>(
      "/purchase",
      purchaseInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function deletePurchase(token: string, purchaseId: number) {
  try {
    const reply = await axios.delete<{ message: string }>(
      `/purchase/${purchaseId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function getManyPurchase(
  token: string,
  limit?: number,
  offset?: number,
  goodiesId?: number,
  userId?: number
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() },
    { key: "goodiesId", val: goodiesId?.toString() },
    { key: "userId", val: userId?.toString() }
  );
  try {
    const reply = await axios.get<{ message: string; purchases: Purchase[] }>(
      `/purchase/${searchParams.entries() ? "?" + searchParams.toString() : ""}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
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

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}
