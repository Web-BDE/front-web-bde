import { Alert, Button } from "@mui/material";
import { Accomplishment, DeleteAccomplishmentFormData } from "~/models/Accomplishment";
import { generateAlert } from "~/utils/error";

export default function DeleteAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: DeleteAccomplishmentFormData;
}) {
  return (
    <div>
      {generateAlert("error", formData?.error)}
      {generateAlert("success", formData?.success)}
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
