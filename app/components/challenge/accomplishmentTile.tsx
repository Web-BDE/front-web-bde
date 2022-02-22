import { Card, CardContent, Typography } from "@mui/material";
import { Accomplishment } from "~/models/Accomplishment";

export default function AccomplishmentTile({
  accomplishment,
}: {
  accomplishment: Accomplishment;
}) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="h5" component="div">
          {accomplishment.validation}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {accomplishment?.proof}
        </Typography>
      </CardContent>
    </Card>
  );
}
