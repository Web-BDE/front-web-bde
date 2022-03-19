import { Avatar, Typography } from "@mui/material";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";
import ValidateAccomplishmentForm from "./forms/validateAccomplishmentForm";

export default function AccomplishmentDisplay({
  accomplishment,
  userPrivilege,
  validateFormData,
  API_URL,
}: {
  accomplishment: Accomplishment;
  userPrivilege?: number;
  validateFormData?: ValidateAccomplishmentFormData;
  API_URL?: string;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {accomplishment.challenge?.name}
      </Typography>
      <div style={{ textAlign: "center" }}>
        <img
          src={`${
            API_EXTERNAL_URL || "http://localhost:4000/"
          }accomplishment/proof/${accomplishment.proofId}`}
          alt=""
          width="95%"
        />
        <video
          controls
          src={`${
            API_EXTERNAL_URL || "http://localhost:4000/"
          }accomplishment/proof/${accomplishment.proofId}`}
          width="95%"
        />
      </div>
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
        State :{" "}
        {accomplishment.validation +
          (accomplishment.validation === "REFUSED"
            ? `, ${accomplishment.refusedComment}`
            : "")}
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
