import { Avatar, Typography } from "@mui/material";
import { Goodies } from "~/models/Goodies";
import { User } from "~/models/User";

export default function GoodiesDisplay({ goodies }: { goodies: Goodies }) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {goodies.name}
      </Typography>
      <Avatar
        variant="rounded"
        alt={goodies.name}
        src=""
        sx={{ width: 256, height: 256 }}
        style={{ marginLeft: "auto", marginRight: "auto" }}
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
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          Creator : {goodies.creator.pseudo}
        </Typography>
      )}
    </div>
  );
}
