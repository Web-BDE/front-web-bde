import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { Link } from "remix";
import { Goodies } from "~/models/Goodies";

export default function GoodiesTile({
  goodies,
  API_URL,
}: {
  goodies: Goodies;
  API_URL?: string;
}) {
  return (
    <Link style={{ textDecoration: "none" }} to={`/goodies/${goodies.id}`}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Avatar
            variant="rounded"
            src={`${API_URL || "http://localhost:4000/"}goodies/picture/${
              goodies.imageId
            }`}
            alt={goodies.name}
            sx={{ width: 260, height: 260 }}
            style={{ margin: "auto" }}
          />
          <Typography
            style={{ marginTop: "20px" }}
            variant="h5"
            component="div"
          >
            {goodies.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Prix : {goodies.price}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Stock : {goodies.stock - goodies.bought}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
