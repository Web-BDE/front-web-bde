import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { Goodies } from "~/models/Goodies";

import { requireUserInfo } from "~/services/authentication";
import { getGoodies } from "~/services/goodies";
import { createPurchase } from "~/services/purchase";

type LoaderData = {
  goodies?: Goodies;
};

type ActionData = {
  formError?: string;
  formSuccess?: string;
};

function badRequest(data: ActionData) {
  return json(data, 400);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.goodiesId) {
    throw json("Invalid goodies query", 400);
  }

  await requireUserInfo(request, `/shop/${params.challengeId}`);

  const goodies = await getGoodies(request, parseInt(params.goodiesId));

  return { goodies };
};

export const action: ActionFunction = async ({ request, params }) => {
  if (!params.goodiesId) {
    throw json("Invalid goodies query", 404);
  }

  await requireUserInfo(request, `/shop/${params.challengeId}`);

  const form = await request.formData();
  const button = form.get("purchase");

  if (button !== "purchase") {
    return badRequest({ formError: "There was an error" });
  }

  try {
    await createPurchase(request, { goodiesId: parseInt(params.goodiesId) });
  } catch (err) {
    if (err instanceof Error) {
      return badRequest({ formError: err.message });
    }
  }

  return json({ formSuccess: "Goodies bought" }, 201);
};

export default function Goodies() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Goodies</h1>
      <h2>{loaderData.goodies?.name}</h2>
      <p>
        <b>Price : {loaderData.goodies?.price}</b>
      </p>
      <p>{loaderData.goodies?.description}</p>
      <p>Created : {loaderData.goodies?.createdAt}</p>
      <form method="post">
        <p>{actionData?.formError || actionData?.formSuccess}</p>
        <button type="submit" name="purchase" value="purchase">
          Buy
        </button>
      </form>
    </div>
  );
}
