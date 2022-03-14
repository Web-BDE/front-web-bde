import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "remix";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";
import ValidateAccomplishmentForm from "../forms/validateAccomplishmentForm";

export default function AccomplishmentTile({
  accomplishment,
  userPrivilege,
  formData,
}: {
  accomplishment: Accomplishment;
  userPrivilege?: number;
  formData?: ValidateAccomplishmentFormData;
}) {
  return (
    <Card sx={{ minWidth: "350px" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </Typography>
        {accomplishment.challenge && (
          <Link to={`/challenges/${accomplishment.challenge.id}`}>
            <Typography variant="h5" component="div">
              {accomplishment.challenge.name}
            </Typography>
          </Link>
        )}
        {accomplishment.user && (
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {accomplishment.user.pseudo}
          </Typography>
        )}
        <Typography variant="h5" component="div">
          {accomplishment.validation}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {accomplishment.comment}
        </Typography>
      </CardContent>
      {userPrivilege &&
        userPrivilege >= 1 &&
        accomplishment.validation === "PENDING" && (
          <CardActions>
            <ValidateAccomplishmentForm accomplishment={accomplishment} />
          </CardActions>
        )}
    </Card>
  );
}
