import { Avatar, Typography } from "@mui/material";
import { Challenge } from "~/models/Challenge";

export default function ChallengeDisplay({
  challenge,
  API_URL,
}: {
  challenge: Challenge;
  API_URL?: string;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {challenge.name}
      </Typography>
      <Avatar
        variant="rounded"
        src={`${API_URL || "http://localhost:4000/"}challenge/picture/${
          challenge.imageId
        }`}
        alt={challenge.name}
        sx={{ width: 300, height: 300 }}
        style={{ margin: "auto" }}
      />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Récompense : {challenge.reward}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Nombre d'essais maximal : {challenge.maxAtempts}</b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {challenge.description}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        Date de création : {new Date(challenge.createdAt).toLocaleDateString()}
      </Typography>
      {challenge.creator && (
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          Auteur : {challenge.creator.pseudo}
        </Typography>
      )}
    </div>
  );
}
