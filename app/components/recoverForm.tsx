import { Grid, TextField, Button } from "@mui/material";
import { Form, Link } from "remix";

export default function LoginForm({
  formData,
  redirectTo,
}: {
  formData?: {
    error?: string;
    success?: string;
    fields?: { email: string };
    fieldsError?: { email?: string };
  };
  redirectTo: string | null;
}) {
  return (
    <Form method="post" action="/recover">
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
      <Button type="submit" fullWidth variant="contained" color="primary">
        Recover Password
      </Button>
      <Grid container>
        <Grid item>
          <Link to="/login">{"Return to login page"}</Link>
        </Grid>
      </Grid>
    </Form>
  );
}
