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

import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";
import { loadGoodies } from "~/controllers/goodies";

import { Goodies } from "~/models/Goodies";

import { requireAuth } from "~/services/authentication";

//Data structure handled on GET resuests
type LoaderData = {
  goodies?: Goodies[];
};

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/shop");

  return await loadGoodies(token);
};

export default function Shop() {
  const data = useLoaderData<LoaderData>();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Shop
      </Typography>
      <Grid
        style={{ marginTop: "50px" }}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {data.goodies?.map((goodie) => (
          <Grid item xs={2} sm={4} md={4} key={goodie.id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {goodie.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Price : {goodie.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/shop/${goodie.id}`}>
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
