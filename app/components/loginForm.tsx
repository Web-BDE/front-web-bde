import { Grid, TextField, Button, Typography, Alert } from "@mui/material";
import { Link } from "remix";

export type LoginFormData = {
  error?: string;
  success?: string;
  fieldsError?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
    password?: string;
  };
};

export default function LoginForm({
  formData,
  redirectTo,
}: {
  formData?: LoginFormData;
  redirectTo: string | null;
}) {
  return (
    <div>
      <Typography component="h1" variant="h5">
        Log in
      </Typography>
      {formData?.error ? <Alert severity="error">{formData?.error}</Alert> : ""}
      {formData?.success ? (
        <Alert severity="success">{formData?.success}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        <input type="hidden" name="redirectTo" value={redirectTo || "/"} />
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
          autoComplete="current-password"
          defaultValue={formData?.fields?.password}
          error={Boolean(formData?.fieldsError?.password)}
          helperText={formData?.fieldsError?.password}
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
