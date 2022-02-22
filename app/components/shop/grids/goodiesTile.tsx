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

export default function GoodiesTile({ goodies }: { goodies: Goodies }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Avatar
          variant="rounded"
          alt={goodies.name}
          src="../../assets/goodiesDefaultImage.png"
          sx={{ width: 256, height: 256 }}
          style={{ marginLeft: "auto", marginRight: "auto" }}
        ></Avatar>
        <Typography style={{ marginTop: "20px" }} variant="h5" component="div">
          {goodies.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Price : {goodies.price}
        </Typography>
      </CardContent>
      <CardActions style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to={`/shop/${goodies.id}`}>
          <Button size="small">Details</Button>
        </Link>
        <Link to={`/shop/${goodies.id}`}>
          <Button size="small">Buy</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
