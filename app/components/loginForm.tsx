import { Grid, TextField, Button, Box, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, Link, useTransition } from "remix";
import { LoginFormData } from "~/models/User";

export default function LoginForm({
  formData,
  redirectTo,
}: {
  formData?: LoginFormData;
  redirectTo: string | null;
}) {
  const transition = useTransition();

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
        label="Adresse email"
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
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Connexion
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
      <Grid justifyContent="space-between" container>
        <Grid item>
          <Link style={{ color: "#552516" }} to="/register">
            {"S'enregister"}
          </Link>
        </Grid>
        <Grid item>
          <Link style={{ color: "#552516" }} to="/recover">
            {"Mot de passe oublié ?"}
          </Link>
        </Grid>
      </Grid>
    </Form>
  );
}
