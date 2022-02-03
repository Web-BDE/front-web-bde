import {
  ActionFunction,
  json,
  Link,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

import { requireUserInfo } from "~/services/authentication";
import { createGoodies } from "~/services/goodies";
import { APIError } from "~/utils/axios";

type ActionData = {
  formError?: string;
  fieldsError?: {
    name?: string;
    description?: string;
    price?: string;
    buyLimit?: string;
  };
  fields?: {
    name: string;
    description: string;
    price: number;
    buyLimit: number;
  };
  validationError?: string;
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

export const action: ActionFunction = async ({ request }) => {
  await requireUserInfo(request, "/shop/admin");
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");

  if (typeof redirectTo !== "string") {
    return badRequest({ formError: "Invalid form data" });
  }
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
    return badRequest({ formError: "You must fill all the fields" });
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
    return badRequest({ fields, fieldsError });
  }

  try {
    await createGoodies(request, fields);
  } catch (err) {
    if (err instanceof APIError) {
      return badRequest({ formError: err.error.message, fields });
    }
  }

  return redirect(redirectTo);
};

export default function ShopAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <h2>Shop Admin</h2>
      <form method="post">
        <p>{actionData?.formError}</p>
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") || "/shop"}
        />
        <div>
          <div>
            <label htmlFor="name-input">Name</label>
          </div>
          <input
            type="text"
            name="name"
            id="name-input"
            defaultValue={actionData?.fields?.name}
          />
          <p>{actionData?.fieldsError?.name}</p>
        </div>
        <div>
          <div>
            <label htmlFor="description-input">Description</label>
          </div>
          <input
            type="text"
            name="description"
            id="description-input"
            defaultValue={actionData?.fields?.description}
          />
          <p>{actionData?.fieldsError?.description}</p>
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
            defaultValue={actionData?.fields?.price || 0}
          />
          <p>{actionData?.fieldsError?.price}</p>
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
            defaultValue={actionData?.fields?.buyLimit || 1}
          />
          <p>{actionData?.fieldsError?.buyLimit}</p>
        </div>
        <button type="submit">Submit</button>
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
