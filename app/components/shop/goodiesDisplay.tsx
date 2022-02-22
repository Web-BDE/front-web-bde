import { Typography } from "@mui/material";
import { Goodies } from "~/models/Goodies";

export default function GoodiesDisplay({ goodies }: { goodies: Goodies }) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {goodies.name}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Price : {goodies.price}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Buy limit : {goodies.buyLimit}</b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {goodies.description}
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        Creation date : {new Date(goodies.createdAt).toLocaleDateString()}
      </Typography>
    </div>
  );
}
