import { Image } from "@mui/icons-material";
import {
  TextField,
  Button,
  Typography,
  Input,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { Challenge, CreateChallengeFormData } from "~/models/Challenge";
import { User } from "~/models/User";

export default function UpdateChallengeForm({
  challenge,
  formData,
  Auteur,
  API_URL,
}: {
  challenge: Challenge;
  formData?: CreateChallengeFormData;
  Auteur?: User;
  API_URL?: string;
}) {
  const transition = useTransition();

  return (
    <Form
      method="patch"
      action={`/challenges/${challenge.id}`}
      encType="multipart/form-data"
    >
      {/* Hiddent input with the method that the Action function will have to handle */}
      <input type="hidden" name="kind" value="challenge" />
      <Avatar
        variant="rounded"
        src={`${
          API_EXTERNAL_URL || "http://localhost:4000/"
        }challenge/picture/${challenge.imageId}`}
        alt={challenge.name}
        sx={{ width: 300, height: 300 }}
        style={{ margin: "auto" }}
      />
      <div style={{ textAlign: "center" }}>
        <input
          required
          autoComplete="picture"
          accept="image/*"
          type="file"
          name="picture"
          id="picture"
        />
      </div>
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
        fullWidth
        error={Boolean(formData?.fieldsError?.description)}
        helperText={formData?.fieldsError?.description}
        name="description"
        defaultValue={formData?.fields?.description || challenge.description}
        label="Description"
        id="description"
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
          defaultValue={formData?.fields?.reward || challenge.reward}
          error={Boolean(formData?.fieldsError?.reward)}
          helperText={formData?.fieldsError?.reward}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="max-atempts"
          label="Nombre maximum d'essais"
          type="number"
          id="max-atempts"
          defaultValue={formData?.fields?.maxAtempts || challenge.maxAtempts}
          error={Boolean(formData?.fieldsError?.maxAtempts)}
          helperText={formData?.fieldsError?.maxAtempts}
        />
      </div>
      <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
        Date de création : {new Date(challenge.createdAt).toLocaleDateString()}
      </Typography>
      {Auteur && (
        <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
          Auteur : {Auteur?.pseudo}
        </Typography>
      )}
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Mettre à jour
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
