import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
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
        <form method="post" action={`/challenges/${accomplishment.challengeId}`}>
          {/* Method handled by the form */}
          <input type="hidden" name="method" value="update-accomplishment" />
          {/* Id of the accomplishment to handle */}
          <input
            type="hidden"
            name="accomplishmentId"
            value={accomplishment?.id}
          />
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
        </form>
      </CardContent>
    </Card>
  );
}
