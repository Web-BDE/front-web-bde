import {
  ActionFunction,
  json,
  LoaderFunction,
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
import { getGoodies } from "~/services/goodies";
import { getManyPurchase } from "~/services/purchase";
import { getSelft } from "~/services/user";

import {
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Alert,
} from "@mui/material";

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

  //Load purchases, we don't want to throwAPI errors
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
      <Container>
        <Typography variant="h4">Goodies</Typography>
        {actionData?.updateGoodies?.formError ? (
          <Alert severity="error">{actionData?.updateGoodies.formError}</Alert>
        ) : (
          ""
        )}
        {actionData?.updateGoodies?.formSuccess ? (
          <Alert severity="info">{actionData?.updateGoodies.formSuccess}</Alert>
        ) : (
          ""
        )}
        <form method="post">
          {/* Hiddent input with the method that the Action function will have to handle */}
          <input type="hidden" name="method" value="update-goodies" />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            error={Boolean(actionData?.updateGoodies?.fieldsError?.name)}
            helperText={actionData?.updateGoodies?.fieldsError?.name}
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={
              actionData?.updateGoodies?.fields?.name || goodies.name
            }
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(actionData?.updateGoodies?.fieldsError?.description)}
            helperText={actionData?.updateGoodies?.fieldsError?.description}
            name="description"
            defaultValue={
              actionData?.updateGoodies?.fields?.description ||
              goodies.description
            }
            label="description"
            id="description"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(actionData?.updateGoodies?.fieldsError?.price)}
            helperText={actionData?.updateGoodies?.fieldsError?.price}
            name="price"
            defaultValue={
              actionData?.updateGoodies?.fields?.price || goodies.price
            }
            label="price"
            type="number"
            id="price"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(actionData?.updateGoodies?.fieldsError?.buyLimit)}
            helperText={actionData?.updateGoodies?.fieldsError?.buyLimit}
            name="buy-limit"
            defaultValue={
              actionData?.updateGoodies?.fields?.buyLimit || goodies.buyLimit
            }
            label="buy-limit"
            type="number"
            id="buy-limit"
          />
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            Created : {goodies.createdAt}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Update Goodies
          </Button>
        </form>
      </Container>
    );
  } else {
    return (
      <Container>
        <Typography variant="h3" style={{ marginTop: "10px" }}>
          {goodies.name}
        </Typography>
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          <b>Price : {goodies.price}</b>
        </Typography>
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          <b>Buy limit : {goodies.buyLimit}</b>
        </Typography>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          {goodies.description}
        </Typography>
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Created : {goodies.createdAt}
        </Typography>
      </Container>
    );
  }
}

export default function Goodies() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <Container style={{ marginTop: "50px" }} component="main" maxWidth="xs">
      {displayGoodies(loaderData.goodies, loaderData.userId, actionData)}
      {/* Form to buy goodies */}
      <Container style={{ marginTop: "10px" }}>
        <form method="post">
          {actionData?.purchaseGoodies?.formError ? (
            <Alert severity="error">
              {actionData?.purchaseGoodies.formError}
            </Alert>
          ) : (
            ""
          )}
          {actionData?.purchaseGoodies?.formSuccess ? (
            <Alert severity="info">
              {actionData?.purchaseGoodies.formSuccess}
            </Alert>
          ) : (
            ""
          )}
          <input type="hidden" name="method" value="purchase-goodies" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            name="purchase"
            value="purchase"
            style={{ marginTop: "10px" }}
          >
            Purchase
          </Button>
        </form>
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
