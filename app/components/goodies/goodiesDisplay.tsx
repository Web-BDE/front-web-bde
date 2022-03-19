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
        <b>Prix : {goodies.price}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Limite d'achat : {goodies.buyLimit}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Stock : {goodies.stock - goodies.bought}</b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {goodies.description}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        Date de création : {new Date(goodies.createdAt).toLocaleDateString()}
      </Typography>
      {goodies.Auteur && (
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/users/${goodies.Auteur.id}`}
        >
          <Typography variant="h5" style={{ marginTop: "10px" }}>
            Auteur : {goodies.Auteur.pseudo}
          </Typography>
        </Link>
      )}
    </div>
  );
}
