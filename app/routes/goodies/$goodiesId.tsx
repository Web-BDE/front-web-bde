import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
} from "remix";

import GoodiesDisplay from "~/components/goodies/goodiesDisplay";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import {
  CreateGoodiesFormData,
  DeleteGoodiesFormData,
  Goodies,
} from "~/models/Goodies";

import { requireAuth } from "~/services/authentication";
import { deleteGoodies, getGoodies, updateGoodies } from "~/services/goodies";
import {
  createPurchase,
  deletePurchase,
  getManyPurchase,
} from "~/services/purchase";

import { Container, Typography } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "~/components/userContext";
import UpdateGoodiesForm from "~/components/goodies/forms/updateGoodiesForm";
import PurchaseGoodiesForm from "~/components/goodies/forms/purchaseGoodiesForm";
import { getSelft } from "~/services/user";
import DeleteGoodiesForm from "~/components/goodies/forms/deleteGoodiesForm";
import PurchasesGrid from "~/components/goodies/grids/purchaseGrid";
import {
  Purchase,
  PurchaseGoodiesFormData,
  RefundGoodiesFormData,
} from "~/models/Purchase";

type LoaderData = {
  goodiesResponse?: { error?: string; success?: string; goodies?: Goodies };
  purchaseResponse?: {
    error?: string;
    success?: string;
    purchases?: Purchase[];
  };
};

type ActionData = {
  purchaseGoodiesResponse?: {
    formData?: PurchaseGoodiesFormData;
    success?: string;
    error?: string;
  };
  updateGoodiesResponse?: {
    formData?: CreateGoodiesFormData;
    success?: string;
    error?: string;
  };
  deleteGoodiesResponse?: {
    formData?: DeleteGoodiesFormData;
    success?: string;
    error?: string;
  };
  refundGoodiesResponse?: {
    formData?: RefundGoodiesFormData;
    success?: string;
    error?: string;
  };
};

async function loadPurchase(
  token: string,
  goodiesResponse: { error?: string; success?: string; goodies?: Goodies },
  goodiesCode: number,
  userId?: number
) {
  const { code, ...purchaseResponse } = await getManyPurchase(
    token,
    100,
    0,
    goodiesResponse.goodies?.id,
    userId
  );

  return json({ goodiesResponse, purchaseResponse } as LoaderData, goodiesCode);
}

async function loadGoodies(token: string, goodiesId: number, userId?: number) {
  const { code, ...goodiesResponse } = await getGoodies(token, goodiesId);

  return loadPurchase(token, goodiesResponse, code, userId);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.goodiesId) {
    throw json("Invalid goodies query", 404);
  }

  const token = await requireAuth(request, `/goodies/${params.goodiesId}`);

  const userInfo = (await getSelft(token))?.user;

  return await loadGoodies(token, parseInt(params.goodiesId), userInfo?.id);
};

async function handleCreatePurchase(token: string, goodiesId: number) {
  const { code, ...purchaseGoodiesResponse } = await createPurchase(token, {
    goodiesId: goodiesId,
  });

  return json({ purchaseGoodiesResponse } as ActionData, code);
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
    return json(
      { updateGoodiesResponse: { fields, fieldsError } } as ActionData,
      400
    );
  }

  const { code, ...updateGoodiesResponse } = await updateGoodies(
    token,
    fields,
    goodiesId
  );

  return json(
    {
      updateGoodiesResponse: {
        ...updateGoodiesResponse,
        formData: { fields, fieldsError },
      },
    } as ActionData,
    code
  );
}

async function handleDeleteGoodies(token: string, goodiesId: number) {
  const { code, ...deleteGoodiesResponse } = await deleteGoodies(
    token,
    goodiesId
  );

  if (deleteGoodiesResponse.error) {
    return json({ deleteGoodiesResponse } as ActionData, code);
  }

  return redirect("/goodies");
}

async function handleRefundGoodies(token: string, purchaseId: number) {
  const { code, ...refundGoodiesResponse } = await deletePurchase(
    token,
    purchaseId
  );

  return json({ refundGoodiesResponse } as ActionData, code);
}

export const action: ActionFunction = async ({ request, params, context }) => {
  if (!params.goodiesId) {
    return json(
      {
        updateGoodiesResponse: { error: "Invalid goodies query" },
      } as ActionData,
      404
    );
  }

  const token = await requireAuth(request, `/goodies/${params.challengeId}`);

  //TODO : remove method & use REST routes
  //Initialize form fields
  const form = await request.formData();

  switch (request.method) {
    case "PUT":
      return await handleCreatePurchase(token, parseInt(params.goodiesId));
    case "PATCH":
      //Goodies update fields
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
        return json(
          {
            updateGoodiesResponse: {
              error:
                "Invalid data provided, please check if you have fill all the requierd fields",
            },
          } as ActionData,
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
    case "DELETE":
      const kind = form.get("kind");

      if (typeof kind !== "string") {
        return json(
          {
            deleteGoodiesResponse: {
              error: "There was an error, please try again",
            },
          } as ActionData,
          500
        );
      }

      switch (kind) {
        case "goodies":
          return await handleDeleteGoodies(token, parseInt(params.goodiesId));

        case "purchase":
          const purchaseId = new URL(request.url).searchParams.get(
            "purchaseId"
          );

          if (!purchaseId) {
            return json(
              {
                purchaseGoodiesResponse: { error: "Invalid purchase query" },
              } as ActionData,
              404
            );
          }

          return await handleRefundGoodies(token, parseInt(purchaseId));
      }

    default:
      throw json("Bad request method", 404);
  }
};

// For the creator of the goodies, replace displays by inputs
function displayGoodies(
  goodies: Goodies,
  formData: {
    updateForm?: CreateGoodiesFormData;
    deleteForm?: DeleteGoodiesFormData;
  },
  userId?: number
) {
  if (goodies?.creatorId === userId) {
    return (
      <div>
        <UpdateGoodiesForm goodies={goodies} formData={formData?.updateForm} />
        <DeleteGoodiesForm goodies={goodies} formData={formData?.deleteForm} />
      </div>
    );
  } else {
    return (
      <div>
        <GoodiesDisplay goodies={goodies} />
      </div>
    );
  }
}

export default function Goodies() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const userInfo = useContext(UserContext);

  return (
    <Container style={{ marginTop: "50px" }} component="main">
      <Container maxWidth="xs">
        <Typography variant="h4">Goodies</Typography>
        {generateAlert("error", loaderData.goodiesResponse?.error)}
        {generateAlert("error", actionData?.updateGoodiesResponse?.error)}
        {generateAlert("success", actionData?.updateGoodiesResponse?.success)}
        {generateAlert("error", actionData?.deleteGoodiesResponse?.error)}
        {generateAlert("success", actionData?.deleteGoodiesResponse?.success)}
        {loaderData.goodiesResponse?.goodies && (
          <div>
            {displayGoodies(
              loaderData.goodiesResponse?.goodies,
              {
                updateForm: actionData?.updateGoodiesResponse?.formData,
                deleteForm: actionData?.deleteGoodiesResponse?.formData,
              },
              userInfo?.id
            )}
            <PurchaseGoodiesForm
              goodies={loaderData.goodiesResponse?.goodies}
              formData={actionData?.purchaseGoodiesResponse?.formData}
            />
          </div>
        )}
      </Container>
      {loaderData.purchaseResponse?.purchases && (
        <div style={{ marginTop: "50px" }}>
          <Typography textAlign="center" variant="h4">
            Undelivered purchases
          </Typography>
          {generateAlert("error", loaderData.purchaseResponse.error)}
          {generateAlert("error", actionData?.purchaseGoodiesResponse?.error)}
          {generateAlert(
            "success",
            actionData?.purchaseGoodiesResponse?.success
          )}
          {generateAlert("error", actionData?.refundGoodiesResponse?.error)}
          {generateAlert("success", actionData?.refundGoodiesResponse?.success)}
          <PurchasesGrid
            purchases={loaderData.purchaseResponse.purchases}
            formData={actionData?.refundGoodiesResponse?.formData}
          />
        </div>
      )}
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
