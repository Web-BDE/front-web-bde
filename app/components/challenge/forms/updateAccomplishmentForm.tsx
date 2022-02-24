import {
  Alert,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Accomplishment } from "~/models/Accomplishment";
import { generateAlert } from "~/utils/error";

export type UpdateAccomplishmentFormData = {
  formError?: string;
  formSuccess?: string;
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
};

export default function UpdateAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: UpdateAccomplishmentFormData;
}) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </Typography>
        {generateAlert("error", formData?.error)}
        {generateAlert("success", formData?.success)}
        <form method="post">
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
            error={Boolean(formData?.fieldsError?.proof)}
            helperText={formData?.fieldsError?.proof}
            label="Proof"
            name="proof"
            autoComplete="proof"
            defaultValue={formData?.fields?.proof || accomplishment?.proof}
            autoFocus
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Update
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
