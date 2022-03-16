import { Avatar, Typography } from "@mui/material";
import { Accomplishment, ValidateAccomplishmentFormData } from "~/models/Accomplishment";
import ValidateAccomplishmentForm from "./forms/validateAccomplishmentForm";

export default function AccomplishmentDisplay({
  accomplishment,
  userPrivilege,
  validateFormData,
}: {
  accomplishment: Accomplishment;
  userPrivilege?: number;
  validateFormData?: ValidateAccomplishmentFormData;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {accomplishment.challenge?.name}
      </Typography>
      <Avatar
        variant="rounded"
        alt={accomplishment.comment}
        src=""
        sx={{ width: 256, height: 256 }}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Reward : {accomplishment.challenge?.reward}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>
          Creation Date :
          {new Date(accomplishment.createdAt).toLocaleDateString()}
        </b>
      </Typography>
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        {accomplishment.comment}
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        State : {accomplishment.validation}
      </Typography>
      {accomplishment.validation === "REFUSED" && (
        <Typography variant="body1" style={{ marginTop: "10px" }}>
          {accomplishment.refusedComment}
        </Typography>
      )}
      {userPrivilege && userPrivilege >= 1 && (
        <ValidateAccomplishmentForm
          formData={validateFormData}
          accomplishment={accomplishment}
        />
      )}
    </div>
  );
}
