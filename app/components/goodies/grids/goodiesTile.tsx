import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "remix";
import { Goodies } from "~/models/Goodies";
import PurchaseGoodiesForm from "../forms/purchaseGoodiesForm";

export default function GoodiesTile({ goodies }: { goodies: Goodies }) {
  return (
    <Link style={{ textDecoration: "none" }} to={`/goodies/$^{goodies.id}`}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Avatar
            variant="rounded"
            alt={goodies.name}
            src=""
            sx={{ width: 256, height: 256 }}
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
          <Typography
            style={{ marginTop: "20px" }}
            variant="h5"
            component="div"
          >
            {goodies.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Price : {goodies.price}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
