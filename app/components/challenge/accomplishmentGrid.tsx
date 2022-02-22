import { Alert, Container, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { Accomplishment } from "~/models/Accomplishment";
import { UserContext } from "../userContext";
import AccomplishmentTile from "./accomplishmentTile";
import DeleteAccomplishmentForm, {
  DeleteAccomplishmentFormData,
} from "./deleteAccomplishmentForm";
import UpdateAccomplishmentForm, {
  UpdateAccomplishmentFormData,
} from "./updateAccomplishmentForm";

export type AccomplishmentData = {
  accomplishments?: Accomplishment[];
  error?: string;
};

function displayValidation(
  accomplishment: Accomplishment,
  updateFormData?: UpdateAccomplishmentFormData,
  deleteFormData?: DeleteAccomplishmentFormData
) {
  switch (accomplishment.validation) {
    case null:
      return (
        <Grid item key={accomplishment.id}>
          <UpdateAccomplishmentForm
            accomplishment={accomplishment}
            formData={updateFormData}
          />
          <DeleteAccomplishmentForm
            accomplishment={accomplishment}
            formData={deleteFormData}
          />
        </Grid>
      );
    default:
      return (
        <Grid item key={accomplishment.id}>
          <AccomplishmentTile accomplishment={accomplishment} />
        </Grid>
      );
  }
}

export default function AccomplishmentsGrid({
  accomplishments,
  formData,
}: {
  accomplishments: AccomplishmentData;
  formData?: {
    updateAccomplishment?: UpdateAccomplishmentFormData;
    deleteAccomplishment?: DeleteAccomplishmentFormData;
  };
}) {
  const userInfo = useContext(UserContext);

  return (
    <Container style={{ marginTop: "50px", marginBottom: "50px" }}>
      <Typography variant="h4">Your accomplishments</Typography>
      {accomplishments.error ? (
        <Alert severity="error">{accomplishments.error}</Alert>
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
        {accomplishments.accomplishments?.map((accomplishment) => {
          {
            displayValidation(
              accomplishment,
              formData?.updateAccomplishment,
              formData?.deleteAccomplishment
            );
          }
        })}
      </Grid>
    </Container>
  );
}
