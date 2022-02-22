import { Grid, Typography } from "@mui/material";
import { Challenge } from "~/models/Challenge";
import ChallengeTile from "./challengeTile";

export default function ChallengeGrid({
  challenge,
}: {
  challenge?: Challenge[];
}) {
  return (
    <div>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Challenges
      </Typography>
      <Grid
        style={{ marginTop: "50px" }}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {challenge?.map((goodie) => (
          <ChallengeTile challenge={goodie}></ChallengeTile>
        ))}
      </Grid>
    </div>
  );
}
