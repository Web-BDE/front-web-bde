import { Avatar, Typography } from "@mui/material";
import { Challenge } from "~/models/Challenge";

export default function ChallengeDisplay({
  challenge,
}: {
  challenge: Challenge;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {challenge.name}
      </Typography>
      <Avatar
        variant="rounded"
        alt={challenge.name}
        src=""
        sx={{ width: 256, height: 256 }}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Reward : {challenge.reward}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Max Atempts : {challenge.maxAtempts}</b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {challenge.description}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        Creation date : {new Date(challenge.createdAt).toLocaleDateString()}
      </Typography>
      {challenge.creator && (
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          Creator : {challenge.creator.pseudo}
        </Typography>
      )}
    </div>
  );
}
