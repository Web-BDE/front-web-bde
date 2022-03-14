import {
  Button,
  Card,
  CardContent,
  Input,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { Form } from "remix";
import {
  Accomplishment,
  CreateAccomplishmentFormData,
} from "~/models/Accomplishment";

export default function UpdateAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: CreateAccomplishmentFormData;
}) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </Typography>
        <Form
          method="patch"
          action={`/challenges/${accomplishment.challengeId}?accomplishmentId=${accomplishment.id}`}
          encType="multipart/form-data"
        >
          <input type="hidden" name="kind" value="accomplishment" />
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
            defaultValue={formData?.fields?.comment || accomplishment.comment}
            error={Boolean(formData?.fieldsError?.comment)}
            helperText={formData?.fieldsError?.comment}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Update
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
