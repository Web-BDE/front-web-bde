import {
  ActionFunction,
  json,
  Link,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";

//Controllers
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import { handleRegister } from "~/controllers/authentication";

//MUI Components
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";

//Data caught by POST requests
type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string;
    pseudo?: string;
  };
  fields?: {
    email: string;
    pseudo: string;
    name?: string;
    surname?: string;
  };
};

//Function that handle POST requests
export const action: ActionFunction = async ({ request }) => {
  //Intitialize all fields
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");
  //Register data
  const email = form.get("email");
  const password = form.get("password");
  const confirm = form.get("confirm-password");
  const pseudo = form.get("pseudo");
  const name = form.get("name");
  const surname = form.get("surname");

  //Check if redirection is here, should always be
  if (typeof redirectTo !== "string") {
    return json({ formError: "There was an error, please try again" });
  }

  //Check for fields type
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirm !== "string" ||
    typeof pseudo !== "string" ||
    (typeof name !== "string" && name !== null) ||
    (typeof surname !== "string" && surname !== null)
  ) {
    return json({ formError: "You must fill the required fields" }, 400);
  }

  return await handleRegister(
    email,
    password,
    confirm,
    pseudo,
    redirectTo,
    name ? name : undefined,
    surname ? surname : undefined
  );
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      {actionData?.formError ? (
        <Alert severity="error">{actionData?.formError}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={searchparams.get("redirectTo") || "/"}
        />
        <div style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="name"
            label="name"
            defaultValue={actionData?.fields?.name}
            type="name"
            id="name"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="surname"
            defaultValue={actionData?.fields?.surname}
            label="surname"
            type="surname"
            id="surname"
          />
        </div>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          error={Boolean(actionData?.fieldsError?.email)}
          helperText={actionData?.fieldsError?.email}
          label="Email Address"
          name="email"
          autoComplete="email"
          defaultValue={actionData?.fields?.email}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(actionData?.fieldsError?.password)}
          helperText={actionData?.fieldsError?.password}
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(actionData?.fieldsError?.password)}
          helperText={actionData?.fieldsError?.password}
          name="confirm-password"
          label="Confirm password"
          type="password"
          id="confirm-password"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(actionData?.fieldsError?.pseudo)}
          helperText={actionData?.fieldsError?.pseudo}
          name="pseudo"
          defaultValue={actionData?.fields?.pseudo}
          label="pseudo"
          type="pseudo"
          id="pseudo"
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link to="/register">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
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
