import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "remix";
import { Goodies } from "~/models/Goodies";
import { Purchase, RefundGoodiesFormData } from "~/models/Purchase";
import { User } from "~/models/User";
import DeliverGoodiesForm from "../forms/deliverGoodiesForm";
import RefundGoodiesForm from "../forms/refundGoodiesForm";

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
        {purchase.goodies && (
          <Link to={`/goodies/${purchase.goodies.id}`}>
            <Typography variant="h5" component="div">
              {purchase.goodies?.name}
            </Typography>
          </Link>
        )}
        {purchase.user && (
          <Typography color="text.secondary" component="div">
            {purchase.user.pseudo}
          </Typography>
        )}
      </CardContent>
      {userPrivilege && userPrivilege >= 2 ? (
        <CardActions>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <RefundGoodiesForm purchase={purchase} />
            <DeliverGoodiesForm purchase={purchase} />
          </div>
        </CardActions>
      ) : (
        ""
      )}
    </Card>
  );
}
