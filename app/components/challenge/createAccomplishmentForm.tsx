import { TextField, Button, Typography, Alert } from "@mui/material";

export type CreateAccomplishmentFormData = {
  formError?: string;
  formSuccess?: string;
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
};

export default function CreateAccomplishmentForm({
  formData,
}: {
  formData?: CreateAccomplishmentFormData;
}) {
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
        <input type="hidden" name="method" value="create-accomplishment" />
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
    </div>
  );
}
