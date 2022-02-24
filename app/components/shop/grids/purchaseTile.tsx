import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { Purchase, RefundGoodiesFormData } from "~/models/Purchase";

export default function PurchaseTile({
  purchase,
  userPrivilege,
  formData,
}: {
  purchase: Purchase;
  userPrivilege?: number;
  formData?: RefundGoodiesFormData;
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
      </CardContent>
      {userPrivilege && userPrivilege >= 2 ? (
        <CardActions>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            {/* //TODO mark as delivered */}
            <form method="get">
              <input type="hidden" name="purchaseId" value={purchase.id} />
              <input type="hidden" name="method" value="refund-purchase" />
              <Button
                size="small"
                type="submit"
                name="refund"
                id="refund"
                value="1"
              >
                Mark as delivered
              </Button>
            </form>
          </div>
        </CardActions>
      ) : (
        ""
      )}
    </Card>
  );
}
