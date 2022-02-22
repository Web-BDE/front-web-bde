import { Alert, Button } from "@mui/material";
import { Challenge } from "~/models/Challenge";

export type DeleteChallengeFormData = {
  formError?: string;
  formSuccess?: string;
};

export default function DeleteChallengeForm({
  challenge,
  formData,
}: {
  challenge: Challenge;
  formData?: DeleteChallengeFormData;
}) {
  return (
    <div>
      {formData?.formError ? (
        <Alert severity="error">{formData?.formError}</Alert>
      ) : (
        ""
      )}
      {formData?.formSuccess ? (
        <Alert severity="success">{formData?.formSuccess}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        <input type="hidden" name="method" value="delete-challenge" />
        <input
          type="hidden"
          name="challengeId"
          value={challenge?.id}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Delete
        </Button>
      </form>
    </div>
  );
}
