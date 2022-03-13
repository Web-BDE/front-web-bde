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
import { Challenge } from "~/models/Challenge";
import { User } from "~/models/User";
import ValidateAccomplishmentForm from "../forms/validateAccomplishmentForm";

export default function AccomplishmentTile({
  accomplishment,
  challenge,
  creator,
  userPrivilege,
  formData,
}: {
  accomplishment: Accomplishment;
  challenge?: Challenge;
  creator?: User;
  userPrivilege?: number;
  formData?: ValidateAccomplishmentFormData;
}) {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </Typography>
        <Link to={`/challenges/${challenge?.id}`}>
          <Typography variant="h5" component="div">
            {challenge?.name}
          </Typography>
        </Link>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {creator?.name}
        </Typography>
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
