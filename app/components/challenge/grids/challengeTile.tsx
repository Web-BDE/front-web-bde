import { Image } from "@mui/icons-material";
import { Avatar, Card, CardContent, Typography } from "@mui/material";
import { Link } from "remix";
import { Challenge } from "~/models/Challenge";

export default function ChallengeTile({ challenge }: { challenge: Challenge }) {
  return (
    <Link style={{ textDecoration: "none" }} to={`/challenges/${challenge.id}`}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Avatar
            variant="rounded"
            alt={challenge.name}
            src=""
            sx={{ width: 256, height: 256 }}
            style={{ marginLeft: "auto", marginRight: "auto" }}
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
