import {
  ActionFunction,
  json,
  LoaderFunction,
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
};

import {
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";

export const loader: LoaderFunction = async ({ request }) => {
  return await requireUserInfo(request, "/shop/admin");
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
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <Typography variant="h4">Create Goodies</Typography>
      {actionData?.formError ? (
        <Alert severity="error">{actionData?.formError}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        {/* Hidden input with the redirection URL in it */}
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") || "/shop"}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          error={Boolean(actionData?.fieldsError?.name)}
          helperText={actionData?.fieldsError?.name}
          label="Name"
          name="name"
          autoComplete="name"
          defaultValue={actionData?.fields?.name}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          error={Boolean(actionData?.fieldsError?.description)}
          helperText={actionData?.fieldsError?.description}
          name="description"
          defaultValue={actionData?.fields?.description}
          label="description"
          id="description"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(actionData?.fieldsError?.price)}
          helperText={actionData?.fieldsError?.price}
          name="price"
          defaultValue={actionData?.fields?.price || 0}
          label="price"
          type="number"
          id="price"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(actionData?.fieldsError?.buyLimit)}
          helperText={actionData?.fieldsError?.buyLimit}
          name="buyLimit"
          defaultValue={actionData?.fields?.buyLimit || 1}
          label="buyLimit"
          type="number"
          id="buyLimit"
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Create Goodies
        </Button>
      </form>
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
