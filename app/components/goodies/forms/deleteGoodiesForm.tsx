import { Button } from "@mui/material";
import { Form } from "remix";
import { DeleteGoodiesFormData, Goodies } from "~/models/Goodies";

export default function DeleteGoodiesForm({
  goodies,
  formData,
}: {
  goodies: Goodies;
  formData?: DeleteGoodiesFormData;
}) {
  return (
    <Form method="delete" action={`/goodies/${goodies.id}`}>
      <input type="hidden" name="kind" value="goodies" />
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
