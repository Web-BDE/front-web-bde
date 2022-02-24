import { TextField, Button } from "@mui/material";
import { CreateAccomplishmentFormData } from "~/models/Accomplishment";

export default function CreateAccomplishmentForm({
  formData,
}: {
  formData?: CreateAccomplishmentFormData;
}) {
  return (
    <form method="post">
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="proof"
        label="Proof"
        name="proof"
        autoComplete="proof"
        autoFocus
        defaultValue={formData?.fields?.proof}
        error={Boolean(formData?.fieldsError?.proof)}
        helperText={formData?.fieldsError?.proof}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Submit Proof
      </Button>
    </form>
  );
}
