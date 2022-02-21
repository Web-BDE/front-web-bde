import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";

import { loadChallenges } from "~/controllers/challenge";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { Challenge } from "~/models/Challenge";

import { requireAuth } from "~/services/authentication";

type LoaderData = {
  challenges?: Challenge[];
};

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  const token = await requireAuth(request, "/challenges");

  return await loadChallenges(token);
};

export default function Challenges() {
  const data = useLoaderData<LoaderData>();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Challenges
      </Typography>
      <Grid
        textAlign="center"
        style={{ marginTop: "50px" }}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {data.challenges?.map((challenge) => (
          <Grid item xs={2} sm={4} md={4} key={challenge.id}>
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return generateUnexpectedError(error);
}
