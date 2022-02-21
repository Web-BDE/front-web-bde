import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "remix";
import { Goodies } from "~/models/Goodies";

export default function GoodiesTile({ goodies }: { goodies: Goodies }) {
  return (
    <Grid item xs={2} sm={4} md={4} key={goodies.id}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {goodies.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Price : {goodies.price}
          </Typography>
        </CardContent>
        <CardActions>
          <Link to={`/shop/${goodies.id}`}>
            <Button size="small">Details</Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  );
}
