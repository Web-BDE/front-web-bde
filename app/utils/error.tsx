import { Alert, AlertColor, Container, Grid, Typography } from "@mui/material";
import { Link, ThrownResponse } from "remix";

export function generateExpectedError(caught: ThrownResponse) {
  switch (caught.status) {
    case 401:
      return (
        <Container component="main">
          <Grid style={{ marginTop: "50px" }} textAlign="center">
            {" "}
            <Typography variant="h2">
              You must be <Link to="/login">logged in</Link> to see this data
            </Typography>
          </Grid>
        </Container>
      );
    case 403:
      return (
        <Container component="main">
          <Grid style={{ marginTop: "50px" }} textAlign="center">
            {" "}
            <Typography variant="h2">
              Sorry, you don't have the rights to see this
            </Typography>
          </Grid>
        </Container>
      );
    case 404:
      return (
        <Container component="main">
          <Grid style={{ marginTop: "50px" }} textAlign="center">
            {" "}
            <Typography variant="h2">There is nothing to see here</Typography>
          </Grid>
        </Container>
      );
    default:
      return (
        <Container component="main">
          <Grid style={{ marginTop: "50px" }} textAlign="center">
            {" "}
            <Typography variant="h2">
              {caught.status} {caught.statusText}
            </Typography>
            <Typography variant="body1">{caught.data}</Typography>
          </Grid>
        </Container>
      );
  }
}

export function generateUnexpectedError(error: Error) {
  return (
    <Container component="main">
      <Grid style={{ marginTop: "50px" }} textAlign="center">
        <Typography variant="h2">Something went wrong</Typography>
        <Typography variant="body1">{error.message}</Typography>
      </Grid>
    </Container>
  );
}
export function generateAlert(severity: AlertColor, message?: string) {
  if (message) {
    return (
      <Container maxWidth="xs">
        <Alert severity={severity}>{message}</Alert>
      </Container>
    );
  }
}
