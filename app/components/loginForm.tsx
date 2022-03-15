import { Grid, TextField, Button } from "@mui/material";
import { Form, Link } from "remix";
import { LoginFormData } from "~/models/User";

export default function LoginForm({
  formData,
  redirectTo,
}: {
  formData?: LoginFormData;
  redirectTo: string | null;
}) {
  return (
    //TODO : add action on forms to redirect on apropriate routes
    <Form method="post" action="/login">
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
        error={Boolean(formData?.fieldsError?.password)}
        helperText={formData?.fieldsError?.password}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Sign In
      </Button>
      <Grid justifyContent="space-between" container>
        <Grid item>
          <Link to="/register">{"Sign Up"}</Link>
        </Grid>
        <Grid item>
          <Link to="/recover">{"Recover Password"}</Link>
        </Grid>
      </Grid>
    </Form>
  );
}
