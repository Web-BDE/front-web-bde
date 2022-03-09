import { TextField, Button, Input } from "@mui/material";
import { Form } from "remix";
import { CreateChallengeFormData } from "~/models/Challenge";

export default function CreateChallengeForm({
  formData,
}: {
  formData?: CreateChallengeFormData;
  redirectTo: string | null;
}) {
  return (
    <Form method="put" action="/challenges/admin" encType="multipart/form-data">
      <Input
        margin="dense"
        required
        fullWidth
        autoComplete="picture"
        autoFocus
        defaultValue={formData?.fields?.picture}
        error={Boolean(formData?.fieldsError?.picture)}
        type="file"
        name="picture"
        id="picture"
      />
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
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="reward"
          label="Reward"
          type="number"
          id="reward"
          defaultValue={formData?.fields?.reward || 0}
          error={Boolean(formData?.fieldsError?.reward)}
          helperText={formData?.fieldsError?.reward}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="max-atempts"
          label="Max atempts"
          type="number"
          id="max-atempts"
          defaultValue={formData?.fields?.maxAtempts || 3}
          error={Boolean(formData?.fieldsError?.maxAtempts)}
          helperText={formData?.fieldsError?.maxAtempts}
        />
      </div>
      <Button type="submit" fullWidth variant="contained" color="primary">
        Create Challenge
      </Button>
    </Form>
  );
}
