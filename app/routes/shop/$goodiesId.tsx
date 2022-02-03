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

function badRequest(data: ActionData) {
  return json(data, 400);
}

function validatePrice(price: number) {
  if (price < 0) {
    return "Price must be positive";
  }
}

function validateBuyLimit(buyLimit: number) {
  if (buyLimit < 1) {
    return "Buy limit must be more than 1";
  }
}

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

  const form = await request.formData();
  const button = form.get("purchase");
  const method = form.get("method");

  switch (method) {
    case "purchase-goodies":
      if (button !== "purchase") {
        return badRequest({
          purchaseGoodies: { formError: "There was an error" },
        });
      }

      try {
        await createPurchase(request, {
          goodiesId: parseInt(params.goodiesId),
        });
      } catch (err) {
        if (err instanceof APIError) {
          return badRequest({ purchaseGoodies: { formError: err.error.message } });
        }
      }

      return json({ purchaseGoodies: { formSuccess: "Goodies bought" } }, 201);
    case "update-goodies":
      const name = form.get("name");
      const description = form.get("description");
      const price = form.get("price");
      const buyLimit = form.get("buy-limit");

      if (
        typeof name !== "string" ||
        typeof description !== "string" ||
        typeof price !== "string" ||
        typeof buyLimit !== "string"
      ) {
        return badRequest({
          updateGoodies: { formError: "You must fill all the fields" },
        });
      }

      const fields = {
        name,
        description,
        price: parseInt(price),
        buyLimit: parseInt(buyLimit),
      };
      const fieldsError = {
        reward: validatePrice(parseInt(price)),
        buyLimit: validateBuyLimit(parseInt(buyLimit)),
      };

      if (Object.values(fieldsError).some(Boolean)) {
        return badRequest({ updateGoodies: { fields, fieldsError } });
      }

      try {
        await updateGoodies(request, fields, parseInt(params.goodiesId));
      } catch (err) {
        if (err instanceof APIError) {
          return badRequest({
            updateGoodies: { formError: err.error.message, fields },
          });
        }
      }

      return json({ updateGoodies: { formSuccess: "Goodies updated" } }, 200);
    case "delete-goodies":
      //Try to delete accomplishment
      try {
        await deleteGoodies(request, parseInt(params.goodiesId));
      } catch (err) {
        //We don't want to throw API errors, we will show the in the form instead
        if (err instanceof APIError) {
          return badRequest({
            deleteGoodies: { formError: err.error.message },
          });
        }
      }

      return redirect("/shop");
    case "refund-goodies":
      const purchaseId = form.get("purchaseId");

      if (typeof purchaseId !== "string") {
        return badRequest({
          refundGoodies: { formError: "There was an error" },
        });
      }

      try {
        await deletePurchase(request, parseInt(purchaseId));
      } catch (err) {
        if (err instanceof APIError) {
          return badRequest({
            refundGoodies: { formError: err.error.message },
          });
        }
      }

      return json({ refundGoodies: { formSuccess: "Goodies refuned" } }, 200);
    default:
      throw new Error("There was an error during form handling");
  }
};

function displayGoodies(
  goodies: Goodies,
  userId: number,
  actionData?: ActionData
) {
  if (goodies.creatorId === userId) {
    return (
      <div>
        <form method="post">
          <p>
            {actionData?.updateGoodies?.formError ||
              actionData?.updateGoodies?.formSuccess}
          </p>
          <input type="hidden" name="method" value="update-goodies" />
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
            <p>{actionData?.updateGoodies?.fieldsError?.name}</p>
          </div>
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
            <p>{actionData?.updateGoodies?.fieldsError?.description}</p>
          </div>
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
            <p>{actionData?.updateGoodies?.fieldsError?.price}</p>
          </div>
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
            <p>{actionData?.updateGoodies?.fieldsError?.buyLimit}</p>
          </div>
          <button type="submit">Update</button>
        </form>
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
      <form method="post">
        <p>
          {actionData?.purchaseGoodies?.formError ||
            actionData?.purchaseGoodies?.formSuccess}
        </p>
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

  switch (caught.status) {
    case 401:
      return (
        <div className="container">
          <p>
            You must be <Link to="/login">logged in</Link> to see this data
          </p>
        </div>
      );
    case 403:
      return (
        <div className="container">
          <p>Sorry, you don't have the rights to see this</p>
        </div>
      );
    default:
      <div className="container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <p>{caught.data}</p>
      </div>;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
