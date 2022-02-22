import { TextField, Button, Typography, Alert } from "@mui/material";

export type CreateChallengeFormData = {
  formError?: string;
  formSuccess?: string;
  fieldsError?: {
    name?: string;
    description?: string;
    reward?: string;
  };
  fields?: {
    name: string;
    description: string;
    reward: number;
  };
};

export default function CreateChallengeForm({
  formData,
  redirectTo,
}: {
  formData?: CreateChallengeFormData;
  redirectTo: string | null;
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
        {/* Hidden input with the redirection URL in it */}
        <input
          type="hidden"
          name="redirectTo"
          value={redirectTo || "/challenges"}
        />
        <input type="hidden" name="method" value="create-challenge" />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          defaultValue={formData?.fields?.name}
          error={Boolean(formData?.fieldsError?.name)}
          helperText={formData?.fieldsError?.name}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="description"
          label="description"
          id="description"
          defaultValue={formData?.fields?.description}
          error={Boolean(formData?.fieldsError?.description)}
          helperText={formData?.fieldsError?.description}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="reward"
          label="reward"
          type="number"
          id="reward"
          defaultValue={formData?.fields?.reward || 0}
          error={Boolean(formData?.fieldsError?.reward)}
          helperText={formData?.fieldsError?.reward}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Create Challenge
        </Button>
      </form>
    </div>
  );
}
