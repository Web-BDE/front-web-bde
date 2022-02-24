import { Alert, Button } from "@mui/material";

export type PurchaseGoodiesFormData = {
  error?: string;
  success?: string;
};

export default function PurchaseGoodiesForm ({ formData }: { formData?: PurchaseGoodiesFormData }) {
  return (
    <form method="post">
      {formData?.error ? (
        <Alert severity="error">{formData?.error}</Alert>
      ) : (
        ""
      )}
      {formData?.success ? (
        <Alert severity="success">{formData?.success}</Alert>
      ) : (
        ""
      )}
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
