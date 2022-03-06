import { TextField, Button, Typography } from "@mui/material";
import { Form } from "remix";
import { Challenge, CreateChallengeFormData } from "~/models/Challenge";
import { User } from "~/models/User";

export default function UpdateChallengeForm({
  challenge,
  formData,
  creator,
}: {
  challenge: Challenge;
  formData?: CreateChallengeFormData;
  creator?: User;
}) {
  return (
    <Form method="patch" action={`/challenges/${challenge.id}`}>
      {/* Hiddent input with the method that the Action function will have to handle */}
      <input type="hidden" name="kind" value="challenge" />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="name"
        error={Boolean(formData?.fieldsError?.name)}
        helperText={formData?.fieldsError?.name}
        label="Name"
        name="name"
        autoComplete="name"
        defaultValue={formData?.fields?.name || challenge.name}
        autoFocus
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        error={Boolean(formData?.fieldsError?.description)}
        helperText={formData?.fieldsError?.description}
        name="description"
        defaultValue={formData?.fields?.description || challenge.description}
        label="description"
        id="description"
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
      <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
        Creation date : {new Date(challenge.createdAt).toLocaleDateString()}
      </Typography>
      {creator && (
        <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
          Creator : {creator?.pseudo}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Update Challenge
      </Button>
    </Form>
  );
}
