import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { Link } from "remix";
import { Challenge } from "~/models/Challenge";

export default function ChallengeTile({
  challenge,
  API_URL,
}: {
  challenge: Challenge;
  API_URL?: string;
}) {
  return (
    <Link style={{ textDecoration: "none" }} to={`/challenges/${challenge.id}`}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Avatar
            variant="rounded"
            src={`${API_URL || "http://localhost:4000/"}challenge/picture/${
              challenge.imageId
            }`}
            alt={challenge.name}
            sx={{ width: 260, height: 260 }}
            style={{ margin: "auto" }}
          />
          <Typography
            variant="h5"
            component="div"
            style={{ marginTop: "20px" }}
          >
            {challenge.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Reward : {challenge.reward}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
