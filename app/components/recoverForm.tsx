import { Grid, TextField, Button, Box, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, Link, useTransition } from "remix";

export default function RecoverForm({
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
  const transition = useTransition();

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
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Recover Password
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
