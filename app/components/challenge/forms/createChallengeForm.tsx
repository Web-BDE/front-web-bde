import {
  TextField,
  Button,
  Input,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { CreateChallengeFormData } from "~/models/Challenge";

export default function CreateChallengeForm({
  formData,
}: {
  formData?: CreateChallengeFormData;
  redirectTo: string | null;
}) {
  const transition = useTransition();

  return (
    <Form method="put" action="/challenges/admin" encType="multipart/form-data">
      <Typography variant="h6" style={{ marginTop: "10px" }}>
        <b>Miniature</b>
      </Typography>
      <input
        autoComplete="picture"
        accept="image/*"
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
        label="Nom"
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
        label="Description"
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
          label="Récompense"
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
          label="Nombre d'éssais maximum"
          type="number"
          id="max-atempts"
          defaultValue={formData?.fields?.maxAtempts || 3}
          error={Boolean(formData?.fieldsError?.maxAtempts)}
          helperText={formData?.fieldsError?.maxAtempts}
        />
      </div>
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Create Challenge
        </Button>
        {transition.state === "submitting" && (
          <CircularProgress
            size={24}
            sx={{
              color: blue[500],
              position: "absolute",
              left: "50%",
              marginTop: "6px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Form>
  );
}
