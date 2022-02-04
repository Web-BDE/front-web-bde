import {
  ActionFunction,
  json,
  Link,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";

import { loginUser } from "~/services/authentication";
import { APIError } from "~/utils/axios";

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

import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Container,
  CssBaseline,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

function validateEmail(email: string) {
  if (
    !new RegExp(
      process.env["EMAIL_REGEX"] || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ).test(email)
  ) {
    return "User email must match your student email domain";
  }
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password is too small";
  }
}

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

  const fields = { email, password };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ fields, fieldsError }, 400);
  }

  let loginRedirection;
  try {
    loginRedirection = await loginUser(fields, redirectTo);
  } catch (err) {
    if (err instanceof APIError) {
      return json({ formError: err.error.message, fields }, err.code);
    }
    throw err;
  }

  return loginRedirection;
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: "50px" }}>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
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
      </div>
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
