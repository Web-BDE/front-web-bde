//MUI Components
import { Grid, TextField, Button, Typography, Alert } from "@mui/material";
import { Link } from "remix";

export type RegisterFormData = {
  error?: string;
  success?: string;
  fieldsError?: {
    email?: string;
    password?: string;
    confirm?: string;
    pseudo?: string;
    name?: string;
    surname?: string;
  };
  fields?: {
    email: string;
    pseudo: string;
    name?: string;
    surname?: string;
  };
};

export default function RegisterForm({
  formData,
  redirectTo,
}: {
  formData?: RegisterFormData;
  redirectTo: string | null;
}) {
  return (
    <form method="post" action="/register">
      <input type="hidden" name="redirectTo" value={redirectTo || "/"} />
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="name"
          label="name"
          type="name"
          id="name"
          defaultValue={formData?.fields?.name}
          error={Boolean(formData?.fieldsError?.name)}
          helperText={formData?.fieldsError?.name}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="surname"
          label="surname"
          type="surname"
          id="surname"
          defaultValue={formData?.fields?.surname}
          error={Boolean(formData?.fieldsError?.surname)}
          helperText={formData?.fieldsError?.surname}
        />
      </div>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        defaultValue={formData?.fields?.email}
        error={Boolean(formData?.fieldsError?.email)}
        helperText={formData?.fieldsError?.email}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        error={Boolean(formData?.fieldsError?.password)}
        helperText={formData?.fieldsError?.password}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="confirm-password"
        label="Confirm password"
        type="password"
        id="confirm-password"
        error={Boolean(formData?.fieldsError?.confirm)}
        helperText={formData?.fieldsError?.confirm}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="pseudo"
        label="pseudo"
        type="pseudo"
        id="pseudo"
        defaultValue={formData?.fields?.pseudo}
        error={Boolean(formData?.fieldsError?.pseudo)}
        helperText={formData?.fieldsError?.pseudo}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Sign In
      </Button>
      <Grid container>
        <Grid item>
          <Link to="/login">{"Already have an account ? Sign in"}</Link>
        </Grid>
      </Grid>
    </form>
  );
}
