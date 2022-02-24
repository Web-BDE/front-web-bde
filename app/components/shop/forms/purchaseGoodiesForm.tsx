import { Alert, Button } from "@mui/material";
import { PurchaseGoodiesFormData } from "~/models/Purchase";
import { generateAlert } from "~/utils/error";

export default function PurchaseGoodiesForm ({ formData }: { formData?: PurchaseGoodiesFormData }) {
  return (
    <form method="post">
      {generateAlert("error", formData?.error)}
      {generateAlert("success", formData?.success)}
      <input type="hidden" name="method" value="purchase-goodies" />
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
