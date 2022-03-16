import { Button, TextField } from "@mui/material";
import { Form } from "remix";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";

export default function ValidateAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: ValidateAccomplishmentFormData;
}) {
  return (
    <Form
      style={{ display: "flex", justifyContent: "space-between" }}
      method="patch"
      action={`/challenges/admin?accomplishmentId=${accomplishment.id}`}
    >
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="refusedComment"
        required
        label="Refuse refusedComment"
        name="refusedComment"
        autoComplete="refusedComment"
        autoFocus
        defaultValue={
          formData?.fields?.refusedComment || accomplishment.refusedComment
        }
        error={Boolean(formData?.fieldsError?.refusedComment)}
        helperText={formData?.fieldsError?.refusedComment}
      />
      <Button
        fullWidth
        type="submit"
        name="validation"
        id="validation"
        value="ACCEPTED"
      >
        Validate
      </Button>
      <Button
        fullWidth
        color="error"
        type="submit"
        name="validation"
        value="REFUSED"
        id="validation"
      >
        Refuse
      </Button>
    </Form>
  );
}
