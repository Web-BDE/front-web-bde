import {
  ActionFunction,
  json,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import { handleCreateGoodies } from "~/controllers/goodies";

import { requireUserInfo } from "~/services/authentication";

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

export const action: ActionFunction = async ({ request }) => {
  //Initialise fiels
  await requireUserInfo(request, "/shop/admin");
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");
  //Goodies fields
  const name = form.get("name");
  const description = form.get("description");
  const price = form.get("price");
  const buyLimit = form.get("buy-limit");

  //Invalid rediractTo format, should never happen
  if (typeof redirectTo !== "string") {
    return json({ formError: "Invalid form data" }, 400);
  }

  //Check for field types
  if (
    typeof name !== "string" ||
    (typeof description !== "string" && typeof description !== "undefined") ||
    typeof price !== "string" ||
    typeof buyLimit !== "string"
  ) {
    return json({ formError: "You must fill all the fields" }, 400);
  }

  return await handleCreateGoodies(
    request,
    name,
    description,
    parseInt(price),
    parseInt(buyLimit),
    redirectTo
  );
};

export default function ShopAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <h2>Shop Admin</h2>
      <form method="post">
        <span>{actionData?.formError}</span>
        {/* Redirect hidden input */}
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") || "/shop"}
        />
        {/* Name field */}
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
          <span>{actionData?.fieldsError?.name}</span>
        </div>
        {/* Description fiels */}
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
          <span>{actionData?.fieldsError?.description}</span>
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
            defaultValue={actionData?.fields?.price || 0}
          />
          <span>{actionData?.fieldsError?.price}</span>
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
            defaultValue={actionData?.fields?.buyLimit || 1}
          />
          <span>{actionData?.fieldsError?.buyLimit}</span>
        </div>
        <button type="submit">Submit</button>
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
