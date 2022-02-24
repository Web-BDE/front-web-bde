import { TextField, Button } from "@mui/material";
import { CreateChallengeFormData } from "~/models/Challenge";

export default function CreateChallengeForm({
  formData,
  redirectTo,
}: {
  formData?: CreateChallengeFormData;
  redirectTo: string | null;
}) {
  return (
    <form method="post">
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
  );
}
