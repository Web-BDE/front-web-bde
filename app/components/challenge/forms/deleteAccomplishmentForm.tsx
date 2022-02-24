import { Button } from "@mui/material";
import {
  Accomplishment,
  DeleteAccomplishmentFormData,
} from "~/models/Accomplishment";

export default function DeleteAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: DeleteAccomplishmentFormData;
}) {
  return (
    <form method="post" action={`/challenges/${accomplishment.challengeId}`}>
      <input type="hidden" name="method" value="delete-accomplishment" />
      <input type="hidden" name="accomplishmentId" value={accomplishment?.id} />
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
  );
}
