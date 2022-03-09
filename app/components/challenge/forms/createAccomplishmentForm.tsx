import {
  TextField,
  Button,
  Typography,
  Input,
  FormHelperText,
} from "@mui/material";
import { Form } from "remix";
import { CreateAccomplishmentFormData } from "~/models/Accomplishment";
import { Challenge } from "~/models/Challenge";

export default function CreateAccomplishmentForm({
  formData,
  challenge,
}: {
  challenge: Challenge;
  formData?: CreateAccomplishmentFormData;
}) {
  return (
    <Form
      method="put"
      action={`/challenges/${challenge.id}`}
      encType="multipart/form-data"
    >
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
      <FormHelperText error>{formData?.fieldsError?.proof}</FormHelperText>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="comment"
        label="comment"
        name="comment"
        autoComplete="comment"
        autoFocus
        defaultValue={formData?.fields?.comment}
        error={Boolean(formData?.fieldsError?.comment)}
        helperText={formData?.fieldsError?.comment}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Submit accomplishment
      </Button>
    </Form>
  );
}
