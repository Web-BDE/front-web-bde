import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import {
  handleDeleteGoodies,
  handleUpdateGoodies,
} from "~/controllers/goodies";
import {
  handleCreatePurchase,
  handleDeletePurchase,
} from "~/controllers/purchase";
import { Goodies } from "~/models/Goodies";
import { Purchase } from "~/models/Purchase";

import { requireUserInfo } from "~/services/authentication";
import { deleteGoodies, getGoodies, updateGoodies } from "~/services/goodies";
import {
  createPurchase,
  deletePurchase,
  getManyPurchase,
} from "~/services/purchase";
import { getSelft } from "~/services/user";
import { APIError } from "~/utils/axios";

type LoaderData = {
  goodies: Goodies;
  userId: number;
  privilege: number;
  purchases?: {
    purchases?: Purchase[];
    purchasesError?: string;
  };
};

type ActionData = {
  purchaseGoodies?: {
    formError?: string;
    formSuccess?: string;
  };
  updateGoodies?: {
    formError?: string;
    formSuccess?: string;
    fieldsError?: {
      name?: string;
      description?: string;
      price?: string;
      buyLimit?: string;
    };
    fields?: {
      name: string;
      description?: string;
      price: number;
      buyLimit: number;
    };
  };
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

  const userInfo = await requireUserInfo(
    request,
    `/shop/${params.challengeId}`
  );

  const privilege = (await getSelft(request)).privilege;

  const goodies = await getGoodies(request, parseInt(params.goodiesId));

  //Load purchase, we don't want to throwAPI errors
  let purchases;
  try {
    purchases = await getManyPurchase(request);
  } catch (err) {
    return {
      goodies,
      userId: userInfo.userId,
      privilege,
      purchases: { purchasesError: err },
    };
  }

  return {
    goodies,
    userId: userInfo.userId,
    privilege,
    purchases: { purchases },
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.goodiesId) {
    throw json("Invalid goodies query", 404);
  }

  await requireUserInfo(request, `/shop/${params.challengeId}`);

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

  switch (method) {
    case "purchase-goodies":
      if (button !== "purchase") {
        return json(
          {
            purchaseGoodies: { formError: "There was an error" },
          },
          400
        );
      }

      return await handleCreatePurchase(request, parseInt(params.goodiesId));
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
        request,
        name,
        description,
        parseInt(price),
        parseInt(buyLimit),
        parseInt(params.goodiesId)
      );
    case "delete-goodies":
      return await handleDeleteGoodies(request, parseInt(params.goodiesId));
    case "refund-goodies":
      if (typeof purchaseId !== "string") {
        return json(
          {
            refundGoodies: { formError: "There was an error" },
          },
          400
        );
      }

      return await handleDeletePurchase(request, parseInt(purchaseId));
    default:
      throw new Error("There was an error during form handling");
  }
};

// For the creator of the goodies, replace displays by inputs
function displayGoodies(
  goodies: Goodies,
  userId: number,
  actionData?: ActionData
) {
  if (goodies.creatorId === userId) {
    return (
      <div>
        <form method="post">
          <span>
            {actionData?.updateGoodies?.formError ||
              actionData?.updateGoodies?.formSuccess}
          </span>
          {/* Method input */}
          <input type="hidden" name="method" value="update-goodies" />
          {/* Name field */}
          <div>
            <div>
              <label htmlFor="name-input">Name</label>
            </div>
            <input
              type="text"
              name="name"
              id="name-input"
              defaultValue={
                actionData?.updateGoodies?.fields?.name || goodies.name
              }
            />
            <span>{actionData?.updateGoodies?.fieldsError?.name}</span>
          </div>
          {/* Description field */}
          <div>
            <div>
              <label htmlFor="description-input">Description</label>
            </div>
            <input
              type="text"
              name="description"
              id="description-input"
              defaultValue={
                actionData?.updateGoodies?.fields?.description ||
                goodies.description
              }
            />
            <span>{actionData?.updateGoodies?.fieldsError?.description}</span>
          </div>
          {/* Price field */}
          <div>
            <div>
              <label htmlFor="price-input">Price</label>
            </div>
            <input
              type="number"
              name="price"
              id="price-input"
              min="0"
              defaultValue={
                actionData?.updateGoodies?.fields?.price || goodies.price
              }
            />
            <span>{actionData?.updateGoodies?.fieldsError?.price}</span>
          </div>
          {/* Buy limit field */}
          <div>
            <div>
              <label htmlFor="buy-limit-input">Buy limit</label>
            </div>
            <input
              type="number"
              name="buy-limit"
              id="buy-limit-input"
              min="0"
              defaultValue={
                actionData?.updateGoodies?.fields?.buyLimit || goodies.buyLimit
              }
            />
            <span>{actionData?.updateGoodies?.fieldsError?.buyLimit}</span>
          </div>
          <button type="submit">Update</button>
        </form>
        {/* Form to delete goodies, only for creator */}
        <form method="post">
          <input type="hidden" name="method" value="delete-goodies" />
          <button type="submit">Delete</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>{goodies?.name}</h2>
        <p>
          <b>Price : {goodies?.price}</b>
        </p>
        <p>{goodies?.description}</p>
        <p>Created : {goodies?.createdAt}</p>
      </div>
    );
  }
}

export default function Goodies() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="container">
      <h2>Goodies</h2>
      {displayGoodies(loaderData.goodies, loaderData.userId, actionData)}
      {/* Form to buy goodies */}
      <form method="post">
        <span>
          {actionData?.purchaseGoodies?.formError ||
            actionData?.purchaseGoodies?.formSuccess}
        </span>
        <input type="hidden" name="method" value="purchase-goodies" />
        <button type="submit" name="purchase" value="purchase">
          Buy
        </button>
      </form>
    </div>
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
