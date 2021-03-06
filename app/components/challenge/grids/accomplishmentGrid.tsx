import { Grid } from "@mui/material";
import {
  Accomplishment,
  CreateAccomplishmentFormData,
  DeleteAccomplishmentFormData,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";
import AccomplishmentTile from "./accomplishmentTile";
import DeleteAccomplishmentForm from "../forms/deleteAccomplishmentForm";
import UpdateAccomplishmentForm from "../forms/updateAccomplishmentForm";
import { useOutletContext } from "remix";
import { ContextData } from "~/root";

function displayAccomplishment(
  accomplishment: Accomplishment,
  formData: {
    updateForm?: CreateAccomplishmentFormData;
    deleteForm?: DeleteAccomplishmentFormData;
    validateForm?: ValidateAccomplishmentFormData;
  },
  userPrivilege?: number,
  userId?: number
) {
  if (
    accomplishment.validation === "PENDING" &&
    accomplishment.user?.id === userId
  ) {
    return (
      <div>
        <UpdateAccomplishmentForm
          accomplishment={accomplishment}
          formData={formData.updateForm}
        />
        <DeleteAccomplishmentForm
          accomplishment={accomplishment}
          formData={formData.deleteForm}
        />
      </div>
    );
  } else {
    return (
      <AccomplishmentTile
        accomplishment={accomplishment}
        userPrivilege={userPrivilege}
        formData={formData.validateForm}
      />
    );
  }
}

export default function AccomplishmentsGrid({
  accomplishments,
  formData,
}: {
  accomplishments: Accomplishment[];
  formData: {
    updateForm?: CreateAccomplishmentFormData;
    deleteForm?: DeleteAccomplishmentFormData;
    validateForm?: ValidateAccomplishmentFormData;
  };
}) {
  const { userInfo } = useOutletContext<ContextData>();

  return (
    <Grid
      textAlign="center"
      container
      style={{ marginTop: "10px" }}
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 1, sm: 8, md: 12 }}
    >
      {/* Display the user's accomplishments */}
      {accomplishments.map((accomplishment) => {
        {
          return (
            <Grid item key={accomplishment.id}>
              {displayAccomplishment(
                accomplishment,
                formData,
                userInfo?.privilege,
                userInfo?.id
              )}
            </Grid>
          );
        }
      })}
    </Grid>
  );
}
