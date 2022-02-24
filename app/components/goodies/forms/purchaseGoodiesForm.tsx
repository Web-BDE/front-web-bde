import { Button } from "@mui/material";
import { Goodies } from "~/models/Goodies";
import { PurchaseGoodiesFormData } from "~/models/Purchase";

export default function PurchaseGoodiesForm({
  formData,
  goodies,
}: {
  goodies: Goodies;
  formData?: PurchaseGoodiesFormData;
}) {
  return (
    <form method="post" action={`/goodies/${goodies.id}`}>
      <input type="hidden" name="method" value="purchase-goodies" />
      <input type="hidden" name="goodiesId" value={goodies.id} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        name="purchase"
        value="purchase"
        style={{ marginTop: "10px" }}
      >
        Purchase
      </Button>
    </form>
  );
}
