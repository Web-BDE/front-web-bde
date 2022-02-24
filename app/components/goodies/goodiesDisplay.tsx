import { Typography } from "@mui/material";
import { Goodies } from "~/models/Goodies";
import { User } from "~/models/User";

export default function GoodiesDisplay({
  goodies,
  creator,
}: {
  goodies: Goodies;
  creator?: User;
}) {
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
      {creator && (
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Creator : {creator.pseudo}
        </Typography>
      )}
    </div>
  );
}
