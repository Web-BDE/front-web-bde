import {
  ActionFunction,
  json,
  Link,
  redirect,
  useActionData,
  useCatch,
  useSearchParams,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";

import { loginUser } from "~/services/authentication";
import { registerUser } from "~/services/user";
import { APIError } from "~/utils/axios";

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
  Box,
  Alert,
} from "@mui/material";

function badRequest(data: ActionData) {
  return json(data, 400);
}

function validateEmail(email: string) {
  if (
    !new RegExp(
      process.env["EMAIL_REGEX"] || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ).test(email)
  ) {
    return "User email must match your student email domain";
  }
}

function validatePassword(password: string, confirm: string) {
  if (password !== confirm) {
    return "Passwords need to match";
  }
  if (password.length < 8) {
    return "Password is too small";
  }
}

function validatePseudo(pseudo: string) {
  if (pseudo.length < 3) {
    return "Pseudo is too small";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const confirm = form.get("confirm-password");
  const pseudo = form.get("pseudo");
  const name = form.get("name");
  const surname = form.get("surname");
  const redirectTo = form.get("redirectTo");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirm !== "string" ||
    typeof redirectTo !== "string" ||
    typeof pseudo !== "string" ||
    (typeof name !== "string" && name !== null) ||
    (typeof surname !== "string" && surname !== null)
  ) {
    return badRequest({ formError: "You must fill the required fields" });
  }

  const fields = {
    email,
    password,
    pseudo,
    name: name ? name : undefined,
    surname: surname ? surname : undefined,
  };
  const fieldsError = {
    email: validateEmail(email),
    password: validatePassword(password, confirm),
    pseudo: validatePseudo(pseudo),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return badRequest({ fields, fieldsError });
  }

  try {
    await registerUser(fields);
  } catch (err) {
    if (err instanceof APIError) {
      return badRequest({ formError: err.error.message, fields });
    }
    throw err;
  }

  let loginRedirection;
  try {
    loginRedirection = await loginUser(fields, redirectTo);
  } catch (err) {
    if (err instanceof APIError) {
      return badRequest({ formError: err.error.message, fields });
    }
    throw err;
  }

  return loginRedirection;
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchparams] = useSearchParams();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: "50px" }}>
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
