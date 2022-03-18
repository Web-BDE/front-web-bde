import { Grid, TextField, Button, Box, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, Link, useTransition } from "remix";

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
  const transition = useTransition();

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
      <Box>
        <Button disabled={transition.state === "submitting"} type="submit" fullWidth variant="contained" color="primary">
          Change Password
        </Button>
        {transition.state === "submitting" && (
          <CircularProgress
            size={24}
            sx={{
              color: blue[500],
              position: "absolute",
              left: "50%",
              marginTop: "6px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
      <Grid container>
        <Grid item>
          <Link to="/login">{"Return to login page"}</Link>
        </Grid>
      </Grid>
    </Form>
  );
}
