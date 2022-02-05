import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Accomplishment } from "~/models/Accomplishment";

type FormData = {
  formError?: string;
  formSuccess?: string;
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
};

type AccomplishmentData = {
  accomplishments?: Accomplishment[];
  error?: string;
  userId: number;
  challengeId: number;
};

function displayValidation(
  state: number | null,
  formData?: FormData,
  accomplishment?: Accomplishment,
  date?: string
) {
  switch (state) {
    case 1:
      return (
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {date}
            </Typography>
            <Typography variant="h5" component="div">
              Accepted
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {accomplishment?.proof}
            </Typography>
          </CardContent>
        </Card>
      );
    case -1:
      return (
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {date}
            </Typography>
            <Typography variant="h5" component="div">
              Refused
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {accomplishment?.proof}
            </Typography>
          </CardContent>
        </Card>
      );
    default:
      return (
        <Container>
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {date}
              </Typography>
              <form method="post">
                <input
                  type="hidden"
                  name="method"
                  value="update-accomplishment"
                />
                <input
                  type="hidden"
                  name="accomplishmentId"
                  value={accomplishment?.id}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="proof"
                  error={Boolean(formData?.fieldsError?.proof)}
                  helperText={formData?.fieldsError?.proof}
                  label="Proof"
                  name="proof"
                  autoComplete="proof"
                  defaultValue={
                    formData?.fields?.proof || accomplishment?.proof
                  }
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Update
                </Button>
              </form>
              {/* Form to delete the accomplishment */}
              <form method="post">
                <input
                  type="hidden"
                  name="method"
                  value="delete-accomplishment"
                />
                <input
                  type="hidden"
                  name="accomplishmentId"
                  value={accomplishment?.id}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  Delete
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      );
  }
}

export default function Accomplishments({
  accomplishments,
  formData,
}: {
  accomplishments: AccomplishmentData;
  formData?: FormData;
}) {
  return (
    <Container style={{ marginTop: "50px", marginBottom: "50px" }}>
      <Typography variant="h4">Your accomplishments</Typography>
      {formData?.formSuccess ? (
        <Alert severity="info">{formData?.formSuccess}</Alert>
      ) : (
        ""
      )}
      {formData?.formError ? (
        <Alert severity="error">{formData?.formError}</Alert>
      ) : (
        ""
      )}
      <Grid
        textAlign="center"
        container
        style={{ marginTop: "10px" }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {/* Display the user's accomplishments */}
        {accomplishments.accomplishments
          ?.filter((accomplishment) => {
            return (
              accomplishment.userId === accomplishments.userId &&
              accomplishment.challengeId === accomplishments.challengeId
            );
          })
          // sort by most recent
          .sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((accomplishment) => {
            return (
              <Grid item key={accomplishment.id}>
                {displayValidation(
                  accomplishment.validation,
                  formData,
                  accomplishment,
                  accomplishment.createdAt
                )}
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
}
