import {
  TextField,
  Button,
  Typography,
  Input,
  FormHelperText,
  Box,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { CreateAccomplishmentFormData } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";

export default function CreateAccomplishmentForm({
  formData,
  challenge,
}: {
  challenge: Challenge;
  formData?: CreateAccomplishmentFormData;
}) {
  const transition = useTransition();

  return (
    <Form
      method="put"
      action={`/challenges/${challenge.id}`}
      encType="multipart/form-data"
    >
      <input
        required
        autoComplete="proof"
        accept="image/*, video/*"
        type="file"
        name="proof"
        id="proof"
      />
      <FormHelperText error>{formData?.fieldsError?.proof}</FormHelperText>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="comment"
        label="Commentaire"
        name="comment"
        autoComplete="comment"
        autoFocus
        defaultValue={formData?.fields?.comment}
        error={Boolean(formData?.fieldsError?.comment)}
        helperText={formData?.fieldsError?.comment}
      />
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Soumettre l'accomplissement
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
