import { Button } from "@mui/material";
import { Challenge, DeleteChallengeFormData } from "~/models/Challenge";

export default function DeleteChallengeForm({
  challenge,
  formData,
}: {
  challenge: Challenge;
  formData?: DeleteChallengeFormData;
}) {
  return (
    <form method="post" action={`/challenges/${challenge.id}`}>
      <input type="hidden" name="method" value="delete-challenge" />
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
  );
}
