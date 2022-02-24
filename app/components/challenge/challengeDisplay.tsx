import { Typography } from "@mui/material";
import { Challenge } from "~/models/Challenge";
import { User } from "~/models/User";

export default function ChallengeDisplay({
  challenge,
  creator,
}: {
  challenge: Challenge;
  creator?: User;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {challenge.name}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Reward : {challenge.reward}</b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {challenge.description}
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        Creation date : {new Date(challenge.createdAt).toLocaleDateString()}
      </Typography>
      {creator && (
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          Creator : {creator?.pseudo}
        </Typography>
      )}
    </div>
  );
}
