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
  userPrivilege,
  validateFormData,
  API_URL,
}: {
  accomplishment: Accomplishment;
  formData?: CreateAccomplishmentFormData;
  userPrivilege?: number;
  validateFormData?: ValidateAccomplishmentFormData;
  API_URL?: string;
}) {
  const transition = useTransition();

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
          alt="Failed to get the proof, please reload the page"
          width="300"
        />
      </div>
      <input
        required
        autoComplete="proof"
        autoFocus
        accept="image/*,video/*"
        type="file"
        name="proof"
        id="proof"
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="comment"
        error={Boolean(formData?.fieldsError?.comment)}
        helperText={formData?.fieldsError?.comment}
        label="Comment"
        name="comment"
        autoComplete="comment"
        defaultValue={formData?.fields?.comment || accomplishment.comment}
        autoFocus
      />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Reward : {accomplishment.challenge?.reward}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>
          Creation Date :
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        State : {accomplishment.validation}
      </Typography>
      {accomplishment.validation === "REFUSED" && (
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          {accomplishment.refusedComment}
        </Typography>
      )}
      {userPrivilege && userPrivilege >= 1 && (
        <ValidateAccomplishmentForm
          formData={validateFormData}
          accomplishment={accomplishment}
        />
      )}
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Update Accomplishment
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
