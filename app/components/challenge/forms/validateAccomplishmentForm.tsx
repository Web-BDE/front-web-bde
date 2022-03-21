import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";

export default function ValidateAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: ValidateAccomplishmentFormData;
}) {
  const transition = useTransition();

  return (
    <Form
      method="patch"
      action={`/challenges/admin?accomplishmentId=${accomplishment.id}`}
    >
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="refused-comment"
        label="Commentaire en cas de refus"
        name="refused-comment"
        autoComplete="refused-comment"
        autoFocus
        defaultValue={
          formData?.fields?.refusedComment || accomplishment.refusedComment
        }
        error={Boolean(formData?.fieldsError?.refusedComment)}
        helperText={formData?.fieldsError?.refusedComment}
      />
      <Button
        fullWidth
        variant="contained"
        type="submit"
        name="validation"
        id="validation"
        value="ACCEPTED"
      >
        Valider
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
      <Button
        fullWidth
        variant="contained"
        color="error"
        type="submit"
        name="validation"
        value="REFUSED"
        id="validation"
      >
        Refuser
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
    </Form>
  );
}
