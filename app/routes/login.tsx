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

//MUI Components
import {
  Grid,
  TextField,
  Button,
  Typography,
  Container,
  CssBaseline,
  Alert,
} from "@mui/material";
import { handleLogin } from "~/controllers/authentication";

//Data structure handled on POST requests
type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
  };
};

//Function that handle POST requests
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ formError: "You must fill all the form" }, 400);
  }

  return await handleLogin(email, password, redirectTo);
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: "50px" }}>
      <Typography component="h1" variant="h5">
        Log in
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
          autoComplete="current-password"
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
