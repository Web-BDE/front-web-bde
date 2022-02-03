import { json } from "remix";
import { createPurchase, deletePurchase } from "~/services/purchase";
import { APIError } from "~/utils/axios";

export async function handleCreatePurchase(
  request: Request,
  goodiesId: number
) {
  try {
    await createPurchase(request, {
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
  request: Request,
  purchaseId: number
) {
  try {
    await deletePurchase(request, purchaseId);
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
