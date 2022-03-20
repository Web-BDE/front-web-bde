import { Avatar, Typography } from "@mui/material";
import { User } from "~/models/User";

export default function UserDisplay({
  user,
  API_URL,
}: {
  user: User;
  API_URL?: string;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {user.pseudo}
      </Typography>
      <Avatar
        src={`${API_EXTERNAL_URL || "http://localhost:4000/"}user/avatar/${
          user.avatarId
        }`}
        alt={user.pseudo}
        sx={{ width: 300, height: 300 }}
        style={{ margin: "auto" }}
      />
      {user.name && (
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          <b>Nom : {user.name}</b>
        </Typography>
      )}
      {user.surname && (
        <Typography variant="h5" style={{ marginTop: "10px" }}>
          <b>Prénom : {user.surname}</b>
        </Typography>
      )}
    </div>
  );
}
