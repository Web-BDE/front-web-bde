import { Grid, TextField, Button } from "@mui/material";
import { Form, Link } from "remix";

export default function ChangePasswordForm({
  formData,
  redirectTo,
  token,
}: {
  formData?: {
    error?: string;
    success?: string;
    fields?: { password: string };
    fieldsError?: { password?: string };
  };
  redirectTo: string | null;
  token: string;
}) {
  return (
    <Form
      method="patch"
      action={`/recover?token=${token || ""}&redirectTo=${redirectTo || ""}`}
    >
      <input type="hidden" name="redirectTo" value={redirectTo || "/"} />
      <TextField
        variant="outlined"
        margin="normal"
        required
        type="password"
        fullWidth
        id="password"
        label="Password"
        name="password"
        autoComplete="password"
        autoFocus
        defaultValue={formData?.fields?.password}
        error={Boolean(formData?.fieldsError?.password)}
        helperText={formData?.fieldsError?.password}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        type="password"
        fullWidth
        id="confirm"
        label="Confirm"
        name="confirm"
        autoComplete="confirm"
        autoFocus
        error={Boolean(formData?.fieldsError?.password)}
        helperText={formData?.fieldsError?.password}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Change Password
      </Button>
      <Grid container>
        <Grid item>
          <Link to="/login">{"Return to login page"}</Link>
        </Grid>
      </Grid>
    </Form>
  );
}
