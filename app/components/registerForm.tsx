//MUI Components
import { Grid, TextField, Button, Typography, Alert } from "@mui/material";
import { Link } from "remix";

type FormData = {
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

export default function RegisterForm({
  formData,
  redirectTo,
}: {
  formData?: FormData;
  redirectTo: string | null;
}) {
  return (
    <div>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      {formData?.formError ? (
        <Alert severity="error">{formData?.formError}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        <input type="hidden" name="redirectTo" value={redirectTo || "/"} />
        <div style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="name"
            label="name"
            defaultValue={formData?.fields?.name}
            type="name"
            id="name"
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="surname"
            defaultValue={formData?.fields?.surname}
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
          error={Boolean(formData?.fieldsError?.email)}
          helperText={formData?.fieldsError?.email}
          label="Email Address"
          name="email"
          autoComplete="email"
          defaultValue={formData?.fields?.email}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(formData?.fieldsError?.password)}
          helperText={formData?.fieldsError?.password}
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
          error={Boolean(formData?.fieldsError?.password)}
          helperText={formData?.fieldsError?.password}
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
          error={Boolean(formData?.fieldsError?.pseudo)}
          helperText={formData?.fieldsError?.pseudo}
          name="pseudo"
          defaultValue={formData?.fields?.pseudo}
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
  );
}
