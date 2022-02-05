import { Accomplishment } from "~/models/Accomplishment";

import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

type ActionData = {
  validateChallenge?: {
    validationError?: string;
  };
};

type LoaderData = {
  accomplishments?: Accomplishment[];
  accomplishmentError?: string;
};

export default function AccomplishmentsAdmin({
  loaderData,
  actionData,
}: {
  loaderData: LoaderData;
  actionData?: ActionData;
}) {
  return (
    <Container component="main" style={{ marginBottom: "50px" }}>
      <Typography
        style={{ textAlign: "center", marginTop: "50px" }}
        variant="h4"
      >
        Pending Accomplishments
      </Typography>
      {loaderData.accomplishmentError ? (
        <Alert severity="error">{loaderData.accomplishmentError}</Alert>
      ) : (
        ""
      )}
      {actionData?.validateChallenge?.validationError ? (
        <Alert severity="error">
          {actionData?.validateChallenge?.validationError}
        </Alert>
      ) : (
        ""
      )}

      <Grid
        textAlign="center"
        style={{ marginTop: "50px" }}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {loaderData.accomplishments
          ?.filter((accomplishment) => {
            return !accomplishment.validation;
          })
          //Sort by oldest
          .sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          })
          .map((accomplishment) => {
            return (
              <Grid item xs={2} sm={4} md={4} key={accomplishment.id}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {accomplishment.proof}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {/* Form to validate an accomplishment */}
                    <form method="post">
                      <input
                        type="hidden"
                        name="accomplishmentId"
                        value={accomplishment.id}
                      />
                      <input
                        type="hidden"
                        name="method"
                        value="validate-accomplishment"
                      />
                      <Button
                        size="small"
                        type="submit"
                        name="validation"
                        id="validation"
                        value="1"
                      >
                        Validate
                      </Button>
                      <Button
                        size="small"
                        type="submit"
                        name="validation"
                        value="-1"
                        id="validation"
                      >
                        Refuse
                      </Button>
                    </form>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
}
