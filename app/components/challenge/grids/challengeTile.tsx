import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "remix";
import { Challenge } from "~/models/Challenge";

export default function ChallengeTile({ challenge }: { challenge: Challenge }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {challenge.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Reward : {challenge.reward}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/challenges/${challenge.id}`}>
          <Button size="small">Details</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
