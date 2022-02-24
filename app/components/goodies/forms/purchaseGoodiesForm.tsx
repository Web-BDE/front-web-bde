import { Button } from "@mui/material";
import { Form } from "remix";
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
    <Form method="put" action={`/goodies/${goodies.id}`}>
      <input type="hidden" name="method" value="purchase" />
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
    </Form>
  );
}
