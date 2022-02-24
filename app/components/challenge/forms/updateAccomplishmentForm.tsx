import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
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
        >
          <input type="hidden" name="kind" value="accomplishment" />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="proof"
            label="Proof"
            name="proof"
            autoComplete="proof"
            autoFocus
            defaultValue={formData?.fields?.proof || accomplishment?.proof}
            error={Boolean(formData?.fieldsError?.proof)}
            helperText={formData?.fieldsError?.proof}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Update
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
