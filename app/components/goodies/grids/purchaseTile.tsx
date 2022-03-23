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
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(purchase.createdAt).toLocaleDateString()}
        </Typography>
        {purchase.goodies && (
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to={`/goodies/${purchase.goodies.id}`}
          >
            <Typography variant="h5" component="div">
              {purchase.goodies?.name}
            </Typography>
          </Link>
        )}
        {purchase.user && (
          <Link
            to={`/users/${purchase.user.id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Typography color="text.secondary" component="div">
              {purchase.user.pseudo}
            </Typography>
          </Link>
        )}
        <Typography variant="h5">
          {purchase.delivered ? "Livré" : "Pas encore livré"}
        </Typography>
      </CardContent>
      {userPrivilege && userPrivilege >= 1 ? (
        <CardActions>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DeliverGoodiesForm
              delivered={purchase.delivered}
              purchase={purchase}
            />
          </div>
        </CardActions>
      ) : (
        ""
      )}
    </Card>
  );
}
