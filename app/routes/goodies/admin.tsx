import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  useActionData,
  useCatch,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "remix";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { requireAuth } from "~/services/authentication";

import { CircularProgress, Container, Typography } from "@mui/material";

import CreateGoodiesForm from "~/components/goodies/forms/createGoodiesForm";
import PurchasesGrid from "~/components/goodies/grids/purchaseGrid";

import { createGoodies, putGoodiesPicture } from "~/services/goodies";
import { CreateGoodiesFormData } from "~/models/Goodies";
import { Purchase } from "~/models/Purchase";
import { getManyPurchase } from "~/services/purchase";
import { blue } from "@mui/material/colors";
import { NodeOnDiskFile } from "@remix-run/node";

type LoaderData = {
  undeliveredPurchaseResponse: {
    error?: string;
    success?: string;
    purchases?: Purchase[];
  };
};

type ActionData = {
  createGoodiesResponse?: {
    formData?: CreateGoodiesFormData;
    error?: string;
    success?: string;
  };
  deliverGoodiesResponse?: {
    error?: string;
    success?: string;
  };
  refundGoodiesResponse?: {
    error?: string;
    success?: string;
  };
};

async function loadUndeliveredPurchases(token: string) {
  const { code, ...undeliveredPurchaseResponse } = await getManyPurchase(
    token,
    100,
    0,
    undefined,
    undefined,
    false
  );

  return json({ undeliveredPurchaseResponse } as LoaderData, code);
}

export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/goodies/admin");

  return loadUndeliveredPurchases(token);
};

//Validator for price fiels
function validatePrice(price: number) {
  if (price < 0) {
    return "Price doit être positif";
  }
}

//Validator for buy limit field
function validateBuyLimit(buyLimit: number) {
  if (buyLimit < 1) {
    return "Buy limit doit être positif";
  }
}

//Validator for buy limit field
function validateStock(stock: number) {
  if (stock < 1) {
    return "Stock doit être positif";
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
        unstable_createMemoryUploadHandler({ maxFileSize: 6_000_000 })
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
                "Données invalides fournies, veuillez vérifier que vous avez compléter tous les champs",
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
      throw json("Mauvais méthode dans la requête", 404);
  }
};

export default function ShopAdmin() {
  const actionData = useActionData<ActionData>();
  const loaderData = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

  const transition = useTransition();

  return (
    <Container>
      <Container component="main" maxWidth="md" style={{ marginTop: "50px" }}>
        <Typography variant="h4">Créer un Goodies</Typography>
        {generateAlert("error", actionData?.createGoodiesResponse?.error)}
        {generateAlert("success", actionData?.createGoodiesResponse?.success)}
        <CreateGoodiesForm
          formData={actionData?.createGoodiesResponse?.formData}
          redirectTo={searchParams.get("redirectTo")}
        />
      </Container>
      <div style={{ marginTop: "50px" }}>
        <Typography textAlign="center" variant="h4">
          Achat non livrés
        </Typography>
        {generateAlert(
          "info",
          loaderData.undeliveredPurchaseResponse?.success &&
            (!loaderData.undeliveredPurchaseResponse?.purchases ||
              loaderData.undeliveredPurchaseResponse.purchases.length === 0)
            ? "Il n'a actuellement aucune commande en cours"
            : undefined
        )}
        {loaderData.undeliveredPurchaseResponse.purchases &&
          loaderData.undeliveredPurchaseResponse.purchases.length !== 0 && (
            <PurchasesGrid
              purchases={loaderData.undeliveredPurchaseResponse.purchases}
            />
          )}
      </div>
      {transition.state === "submitting" && (
        <CircularProgress
          size={36}
          sx={{
            color: blue[500],
            position: "absolute",
            left: "50%",
            marginTop: "18px",
            marginLeft: "-18px",
          }}
        />
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
