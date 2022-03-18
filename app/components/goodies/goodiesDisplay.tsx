import { Avatar, Typography } from "@mui/material";
import { Link } from "remix";
import { Goodies } from "~/models/Goodies";

export default function GoodiesDisplay({
  goodies,
  API_URL,
}: {
  goodies: Goodies;
  API_URL?: string;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {goodies.name}
      </Typography>
        <Avatar
          variant="rounded"
          src={`${API_URL || "http://localhost:4000/"}goodies/picture/${
            goodies.imageId
          }`}
          alt={goodies.name}
          sx={{ width: 400, height: 400 }}
          style={{ margin: "auto" }}
        />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Price : {goodies.price}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Buy limit : {goodies.buyLimit}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>In Stock : {goodies.stock - goodies.bought}</b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {goodies.description}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        Creation date : {new Date(goodies.createdAt).toLocaleDateString()}
      </Typography>
      {goodies.creator && (
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/users/${goodies.creator.id}`}
        >
          <Typography variant="h5" style={{ marginTop: "10px" }}>
            Creator : {goodies.creator.pseudo}
          </Typography>
        </Link>
      )}
    </div>
  );
}
