import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
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

import { createGoodies, putGoodiesPicture } from "~/services/goodies";
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
    return "Buy limit must be more than 0";
  }
}

//Validator for buy limit field
function validateStock(stock: number) {
  if (stock < 1) {
    return "Stock must be more than 0";
  }
}

async function handleCreateGoodies(
  token: string,
  name: string,
  price: number,
  buyLimit: number,
  stock: number,
  picture: Blob,
  description?: string
) {
  const fields = {
    name,
    description,
    price,
    buyLimit,
    stock,
    picture,
  };
  const fieldsError = {
    price: validatePrice(price),
    buyLimit: validateBuyLimit(buyLimit),
    stock: validateStock(stock),
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

  if (createGoodiesResponse.error || !createGoodiesResponse.goodiesId) {
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

  const { code: UploadCode, ...uploadPictureResponse } =
    await putGoodiesPicture(token, createGoodiesResponse.goodiesId, picture);

  if (uploadPictureResponse.error) {
    return json(
      {
        createGoodiesResponse: {
          ...uploadPictureResponse,
          formData: { fields, fieldsError },
        },
      } as ActionData,
      UploadCode
    );
  }

  return redirect("/goodies");
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "PUT":
      //Initialise fiels
      const token = await requireAuth(request, "/goodies/admin");
      const form = await unstable_parseMultipartFormData(
        request,
        unstable_createMemoryUploadHandler({ maxFileSize: 100_000_000 })
      );
      //Goodies fields
      const name = form.get("name");
      const description = form.get("description");
      const price = form.get("price");
      const buyLimit = form.get("buy-limit");
      const stock = form.get("stock");
      const picture = form.get("picture");

      //Check for field types
      if (
        typeof name !== "string" ||
        (typeof description !== "string" && description !== null) ||
        typeof price !== "string" ||
        typeof buyLimit !== "string" ||
        typeof stock !== "string" ||
        !(picture instanceof Blob)
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
        parseInt(stock),
        picture,
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
