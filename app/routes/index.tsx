import { Container, Grid, Typography } from "@mui/material";

export default function Index() {
  return (
    <Container component="main">
      <Grid style={{ marginTop: "50px" }} textAlign="center">
        <Typography variant="h2">Welcome to Web BDE</Typography>
        <Typography variant="body1" color="text.secondary">
          Feel free to explore the application. For more informations plsease
          follow the README
        </Typography>
      </Grid>
    </Container>
  );
}
