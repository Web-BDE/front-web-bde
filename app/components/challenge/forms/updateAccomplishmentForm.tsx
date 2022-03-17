import { Avatar, Button, Input, TextField, Typography } from "@mui/material";
import { Form } from "remix";
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
      <Input
        margin="dense"
        required
        fullWidth
        autoComplete="proof"
        autoFocus
        defaultValue={formData?.fields?.proof}
        error={Boolean(formData?.fieldsError?.proof)}
        type="file"
        name="proof"
        id="proof"
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Update Accomplishment
      </Button>
    </Form>
  );
}
