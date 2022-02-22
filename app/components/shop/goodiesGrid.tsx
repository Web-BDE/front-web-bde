import { Grid, Typography } from "@mui/material";
import { Goodies } from "~/models/Goodies";
import GoodiesTile from "./goodiesTile";

export default function GoodiesGrid({ goodies }: { goodies?: Goodies[] }) {
  return (
    <div>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Shop
      </Typography>
      <Grid
        style={{ marginTop: "50px" }}
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {goodies?.map((goodie) => (
          <Grid item xs={2} sm={4} md={4} key={goodie.id}>
            <GoodiesTile goodies={goodie}></GoodiesTile>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
