import axios from "axios";
import { Goodies } from "~/models/Goodies";

import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

type PurchaseForm = {
  goodiesId: number;
};

export async function createPurchase(
  request: Request,
  purchaseForm: PurchaseForm
) {
  try {
    await axios.put(
      "/purchase",
      {
        goodiesId: purchaseForm.goodiesId,
      },
      { headers: await buildAxiosHeaders(request) }
    );
  } catch (err) {
    handleAPIError(err);
  }

  return "Purchase created";
}

export async function deletePurchase(request: Request, purchaseId: number) {
  let purchase;
  try {
    purchase = (
      await axios.delete(`/purchase/${purchaseId}`, {
        headers: await buildAxiosHeaders(request),
      })
    ).data.purchase;
  } catch (err) {
    handleAPIError(err);
  }
  return "Purchase deleted";
}

export async function getManyPurchase(request: Request) {
  let purchases;
  try {
    purchases = (
      await axios.get<{ message: string; purchase: Goodies[] }>("/purchase", {
        headers: await buildAxiosHeaders(request),
      })
    ).data.purchase;
  } catch (err) {
    handleAPIError(err);
  }
  return purchases;
}

export async function getPurchase(request: Request, purchaseId: number) {
  let purchase;
  try {
    purchase = (
      await axios.get<{ message: string; purchase: Goodies[] }>(
        `/purchase/${purchaseId}`,
        {
          headers: await buildAxiosHeaders(request),
        }
      )
    ).data.purchase;
  } catch (err) {
    handleAPIError(err);
  }
  return purchase;
}
