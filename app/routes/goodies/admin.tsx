import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { requireAuth } from "~/services/authentication";

import { Container, Typography } from "@mui/material";

import CreateGoodiesForm from "~/components/goodies/forms/createGoodiesForm";

import { createGoodies } from "~/services/goodies";
import { CreateGoodiesFormData } from "~/models/Goodies";

type ActionData = {
  createGoodiesResponse?: {
    formData?: CreateGoodiesFormData;
    error?: string;
    success?: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  return await requireAuth(request, "/goodies/admin");
};

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

async function handleCreateGoodies(
  token: string,
  name: string,
  price: number,
  buyLimit: number,
  description?: string
) {
  const fields = {
    name,
    description,
    price,
    buyLimit,
  };
  const fieldsError = {
    price: validatePrice(price),
    buyLimit: validateBuyLimit(buyLimit),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json(
      {
        createGoodiesResponse: { formData: { fields, fieldsError } },
      } as ActionData,
      400
    );
  }

  const { code, ...createGoodiesResponse } = await createGoodies(token, fields);

  if (createGoodiesResponse.error) {
    return json(
      {
        createGoodiesResponse: {
          ...createGoodiesResponse,
          formData: { fields, fieldsError },
        },
      } as ActionData,
      code
    );
  }

  return redirect("/goodies");
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "PUT":
      //Initialise fiels
      const token = await requireAuth(request, "/goodies/admin");
      const form = await request.formData();
      //Goodies fields
      const name = form.get("name");
      const description = form.get("description");
      const price = form.get("price");
      const buyLimit = form.get("buy-limit");

      //Check for field types
      if (
        typeof name !== "string" ||
        (typeof description !== "string" && description !== null) ||
        typeof price !== "string" ||
        typeof buyLimit !== "string"
      ) {
        return json(
          {
            createGoodiesResponse: {
              error:
                "Invalid data provided, please check if you have fill all the requierd fields",
            },
          } as ActionData,
          400
        );
      }

      return await handleCreateGoodies(
        token,
        name,
        parseInt(price),
        parseInt(buyLimit),
        description ? description : undefined
      );

    default:
      throw json("Bad request method", 404);
  }
};

export default function ShopAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <Typography variant="h4">Create Goodies</Typography>
      {generateAlert("error", actionData?.createGoodiesResponse?.error)}
      {generateAlert("success", actionData?.createGoodiesResponse?.success)}
      <CreateGoodiesForm
        formData={actionData?.createGoodiesResponse?.formData}
        redirectTo={searchParams.get("redirectTo")}
      />
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
