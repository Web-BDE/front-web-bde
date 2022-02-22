import { Alert, Button } from "@mui/material";
import { Accomplishment } from "~/models/Accomplishment";

export type DeleteAccomplishmentFormData = {
  formError?: string;
  formSuccess?: string;
};

export default function DeleteAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: DeleteAccomplishmentFormData;
}) {
  console.log(accomplishment);
  return (
    <div>
      {formData?.formError ? (
        <Alert severity="error">{formData?.formError}</Alert>
      ) : (
        ""
      )}
      {formData?.formSuccess ? (
        <Alert severity="success">{formData?.formSuccess}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        <input type="hidden" name="method" value="delete-accomplishment" />
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
    </div>
  );
}
