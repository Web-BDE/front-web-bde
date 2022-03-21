import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import {
  Accomplishment,
  CreateAccomplishmentFormData,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";
import ValidateAccomplishmentForm from "./validateAccomplishmentForm";

export default function AccomplishmentDisplay({
  accomplishment,
  formData,
  API_URL,
}: {
  accomplishment: Accomplishment;
  formData?: CreateAccomplishmentFormData;
  API_URL?: string;
}) {
  const transition = useTransition();
  console.log(accomplishment);
  return (
    <Form
      method="patch"
      action={`/accomplishments/${accomplishment.id}`}
      encType="multipart/form-data"
    >
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {accomplishment.challenge?.name}
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img
          src={`${API_URL || "http://localhost:4000/"}accomplishment/proof/${
            accomplishment.proofId
          }`}
          alt=""
          width="95%"
        />
        <video
          controls
          src={`${API_URL || "http://localhost:4000/"}accomplishment/proof/${
            accomplishment.proofId
          }`}
          width="95%"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <input
          required
          autoComplete="proof"
          accept="image/png, image/jpeg, image/gif, image/svg, video/mp4, video/webm, video/ogg"
          type="file"
          name="proof"
          id="proof"
        />
      </div>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="comment"
        error={Boolean(formData?.fieldsError?.comment)}
        helperText={formData?.fieldsError?.comment}
        label="Commentaires"
        name="comment"
        autoComplete="comment"
        defaultValue={formData?.fields?.comment || accomplishment.comment}
        autoFocus
      />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Récompense : {accomplishment.challenge?.reward}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>
          Date de création :
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        État :{" "}
        {accomplishment.validation +
          (accomplishment.validation === "REFUSED"
            ? `, ${accomplishment.refusedComment}`
            : "")}
      </Typography>
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
