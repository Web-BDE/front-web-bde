import { TextField, Button, Typography, Alert } from "@mui/material";
import { Challenge, CreateChallengeFormData } from "~/models/Challenge";
import { generateAlert } from "~/utils/error";

export default function UpdateChallengeForm({
  challenge,
  formData,
}: {
  challenge: Challenge;
  formData?: CreateChallengeFormData;
}) {
  return (
    <form method="post">
      {/* Hiddent input with the method that the Action function will have to handle */}
      <input type="hidden" name="method" value="update-challenge" />
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
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        error={Boolean(formData?.fieldsError?.reward)}
        helperText={formData?.fieldsError?.reward}
        name="reward"
        defaultValue={formData?.fields?.reward || challenge.reward}
        label="reward"
        type="number"
        id="reward"
      />
      <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
        Creation date : {new Date(challenge.createdAt).toLocaleDateString()}
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Update Challenge
      </Button>
    </form>
  );
}
