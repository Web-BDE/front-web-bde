import { Alert, Button } from "@mui/material";

export type PurchaseGoodiesFormData = {
  formError?: string;
  formSuccess?: string;
};

export default function ({ formData }: { formData?: PurchaseGoodiesFormData }) {
  return (
    <form method="post">
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
