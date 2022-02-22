import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { Purchase } from "~/models/Purchase";

export type RefundPurchaseFormData = {
  formError?: string;
  formSuccess?: string;
};

export default function PurchaseTile({
  purchase,
  userPrivilege,
  formData,
}: {
  purchase: Purchase;
  userPrivilege?: number;
  formData?: RefundPurchaseFormData;
}) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(purchase.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="h5" component="div">
          {purchase.userId}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {purchase?.goodiesId}
        </Typography>
      </CardContent>
      {userPrivilege && userPrivilege >= 2 ? (
        <CardActions>
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
          {/* Form to validate an purchase */}
          <form method="post">
            <input type="hidden" name="purchaseId" value={purchase.id} />
            <input type="hidden" name="method" value="refund-purchase" />
            <Button
              size="small"
              type="submit"
              name="refund"
              id="refund"
              value="1"
            >
              Refund
            </Button>
          </form>
        </CardActions>
      ) : (
        ""
      )}
    </Card>
  );
}
