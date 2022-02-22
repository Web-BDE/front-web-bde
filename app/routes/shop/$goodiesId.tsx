import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";

import GoodiesDisplay from "~/components/shop/goodiesDisplay";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import { Goodies } from "~/models/Goodies";
import { Purchase } from "~/models/Purchase";

import { requireAuth } from "~/services/authentication";
import { deleteGoodies, getGoodies, updateGoodies } from "~/services/goodies";
import {
  createPurchase,
  deletePurchase,
  getManyPurchase,
} from "~/services/purchase";

import { Container } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "~/components/userContext";
import UpdateGoodiesForm, {
  UpdateGoodiesFormData,
} from "~/components/shop/updateGoodiesForm";
import PurchaseGoodiesForm, {
  PurchaseGoodiesFormData,
} from "~/components/shop/purchaseGoodiesForm";
import { APIError } from "~/utils/axios";
import { Params } from "react-router";

type LoaderData = {
  goodies: Goodies;
  purchases: {
    purchases?: Purchase[];
    purchasesError?: string;
  };
};

type ActionData = {
  purchaseGoodies?: PurchaseGoodiesFormData;
  updateGoodies?: UpdateGoodiesFormData;
  deleteGoodies?: {
    formError?: string;
    formSuccess?: string;
  };
  refundGoodies?: {
    formError?: string;
    formSuccess?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.goodiesId) {
    throw json("Invalid goodies query", 400);
  }

  const token = await requireAuth(request, `/shop/${params.goodiesId}`);

  const goodies = (await getGoodies(token, parseInt(params.goodiesId)))
    ?.goodies;

  //Load purchases, we don't want to throwAPI errors
  let purchases;
  try {
    purchases = (await getManyPurchase(token))?.purchases;
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        { goodies, purchases: { purchasesError: err.error.message } },
        err.code
      );
    }
    return json({ goodies, purchases: { purchasesError: err } }, 500);
  }

  return {
    goodies,
    purchases: { purchases },
  };
};

async function handleCreatePurchase(token: string, goodiesId: number) {
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

//Validator for price fiels
function validatePrice(price: number) {
  if (price < 0) {
    return "Price must be positive";
  }
}

//Validator for buy limit field
function validateBuyLimit(buyLimit: number) {
  if (buyLimit < 1) {
    return "Buy limit must be more than 1";
  }
}

async function handleUpdateGoodies(
  token: string,
  name: string,
  description: string,
  price: number,
  buyLimit: number,
  goodiesId: number
) {
  const fields = {
    name,
    description,
    price: price,
    buyLimit: buyLimit,
  };
  const fieldsError = {
    reward: validatePrice(price),
    buyLimit: validateBuyLimit(buyLimit),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ updateGoodies: { fields, fieldsError } }, 400);
  }

  try {
    await updateGoodies(token, fields, goodiesId);
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        {
          updateGoodies: { formError: err.error.message, fields },
        },
        err.code
      );
    }
  }

  return json({ updateGoodies: { formSuccess: "Goodies updated" } }, 200);
}

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.goodiesId) {
    throw json("Invalid goodies query", 404);
  }

  const token = await requireAuth(request, `/shop/${params.challengeId}`);

  //Initialize form fields
  const form = await request.formData();
  const method = form.get("method");
  //Button to buy goodies
  const button = form.get("purchase");
  //Goodies update fields
  const name = form.get("name");
  const description = form.get("description");
  const price = form.get("price");
  const buyLimit = form.get("buy-limit");
  //Refund goodies fields
  const purchaseId = form.get("purchaseId");

  //Should never happend, check if method is present
  if (typeof method !== "string") {
    return json(
      {
        purchaseGoodies: {
          formError: "Something went wrong, please try again",
        },
      },
      500
    );
  }

  async function handleDeleteGoodies(token: string, goodiesId: number) {
    //Try to delete accomplishment
    try {
      await deleteGoodies(token, goodiesId);
    } catch (err) {
      //We don't want to throw API errors, we will show the in the form instead
      if (err instanceof APIError) {
        return json(
          {
            deleteGoodies: { formError: err.error.message },
          },
          err.code
        );
      }
    }

    return redirect("/shop");
  }

  async function handleDeletePurchase(token: string, purchaseId: number) {
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

  switch (method) {
    case "purchase-goodies":
      if (button !== "purchase") {
        return json(
          {
            purchaseGoodies: {
              formError: "There was an error, please try again",
            },
          },
          500
        );
      }

      return await handleCreatePurchase(token, parseInt(params.goodiesId));
    case "update-goodies":
      if (
        typeof name !== "string" ||
        typeof description !== "string" ||
        typeof price !== "string" ||
        typeof buyLimit !== "string"
      ) {
        return json(
          {
            updateGoodies: { formError: "You must fill all the fields" },
          },
          400
        );
      }

      return await handleUpdateGoodies(
        token,
        name,
        description,
        parseInt(price),
        parseInt(buyLimit),
        parseInt(params.goodiesId)
      );
    case "delete-goodies":
      return await handleDeleteGoodies(token, parseInt(params.goodiesId));
    case "refund-goodies":
      if (typeof purchaseId !== "string") {
        return json(
          {
            refundGoodies: { formError: "There was an error" },
          },
          400
        );
      }

      return await handleDeletePurchase(token, parseInt(purchaseId));
    default:
      throw new Error("There was an error during form handling");
  }
};

// For the creator of the goodies, replace displays by inputs
function displayGoodies(
  goodies: Goodies,
  userId?: number,
  formData?: UpdateGoodiesFormData
) {
  if (goodies.creatorId === userId) {
    return (
      <Container>
        <UpdateGoodiesForm goodies={goodies} formData={formData} />
      </Container>
    );
  } else {
    return (
      <Container>
        <GoodiesDisplay goodies={goodies} />
      </Container>
    );
  }
}

export default function Goodies() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const userInfo = useContext(UserContext);

  return (
    <Container style={{ marginTop: "50px" }} component="main" maxWidth="xs">
      {displayGoodies(
        loaderData.goodies,
        userInfo?.id,
        actionData?.updateGoodies
      )}
      {/* Form to buy goodies */}
      <Container style={{ marginTop: "10px" }}>
        <PurchaseGoodiesForm formData={actionData?.purchaseGoodies} />
      </Container>
    </Container>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return generateUnexpectedError(error);
}
