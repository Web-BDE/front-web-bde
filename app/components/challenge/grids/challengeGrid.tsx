import { Grid, Typography } from "@mui/material";
import { Challenge } from "~/models/Challenge";
import ChallengeTile from "./challengeTile";

export default function ChallengeGrid({
  challenges,
  API_URL,
}: {
  challenges?: Challenge[];
  API_URL?: string;
}) {
  return (
    <Grid
      style={{ marginTop: "50px" }}
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 1, sm: 8, md: 12 }}
    >
      {challenges?.map((challenge) => (
        <Grid item xs={2} sm={4} md={4} key={challenge.id}>
          <ChallengeTile
            API_URL={API_URL}
            challenge={challenge}
          ></ChallengeTile>
        </Grid>
      ))}
    </Grid>
  );
}
