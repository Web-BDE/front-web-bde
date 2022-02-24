import { Button } from "@mui/material";
import { Form } from "remix";
import { Challenge, DeleteChallengeFormData } from "~/models/Challenge";

export default function DeleteChallengeForm({
  challenge,
  formData,
}: {
  challenge: Challenge;
  formData?: DeleteChallengeFormData;
}) {
  return (
    <Form method="delete" action={`/challenges/${challenge.id}`}>
      <input type="hidden" name="kind" value="challenge" />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Delete
      </Button>
    </Form>
  );
}
