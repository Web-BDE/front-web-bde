import { json } from "remix";
import { createPurchase, deletePurchase } from "~/services/purchase";
import { APIError } from "~/utils/axios";

export async function handleCreatePurchase(
  token: string,
  goodiesId: number
) {
  try {
    await createPurchase(token, {
      goodiesId: goodiesId,
    });
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        {
          purchaseGoodies: { formError: err.error.message },
        },
        err.code
      );
    }
  }

  return json({ purchaseGoodies: { formSuccess: "Goodies bought" } }, 201);
}

export async function handleDeletePurchase(
  token: string,
  purchaseId: number
) {
  try {
    await deletePurchase(token, purchaseId);
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        {
          refundGoodies: { formError: err.error.message },
        },
        err.code
      );
    }
  }

  return json({ refundGoodies: { formSuccess: "Goodies refuned" } }, 200);
}
