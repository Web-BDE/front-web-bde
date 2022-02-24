import { Button } from "@mui/material";
import { DeleteGoodiesFormData, Goodies } from "~/models/Goodies";

export default function DeleteGoodiesForm({
  goodies,
  formData,
}: {
  goodies: Goodies;
  formData?: DeleteGoodiesFormData;
}) {
  return (
    <form method="post" action={`/goodies/${goodies.id}`}>
      <input type="hidden" name="method" value="delete-goodies" />
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
