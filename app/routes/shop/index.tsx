import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  Link,
  LinksFunction,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import { loadGoodies } from "~/controllers/goodies";

import { Goodies } from "~/models/Goodies";

import { requireUserInfo } from "~/services/authentication";

import contentDisplayStylesheet from "../../styles/contentdisplay.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: contentDisplayStylesheet,
    },
  ];
};

type LoaderData = {
  goodies?: Goodies[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserInfo(request, "/shop");

  return await loadGoodies(request);
};

export default function Shop() {
  const data = useLoaderData<LoaderData>();
  return (
    <Container component="main">
      <Typography
        style={{ textAlign: "center", marginTop: "50px" }}
        variant="h2"
      >
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
