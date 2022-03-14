import { Button } from "@mui/material";
import { Form } from "remix";
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
    <Form
      method="delete"
      action={`/challenges/${
        accomplishment.challengeId || accomplishment.challenge?.id
      }?accomplishmentId=${accomplishment.id}`}
    >
      <input type="hidden" name="kind" value="accomplishment" />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Delete
      </Button>
    </Form>
  );
}
