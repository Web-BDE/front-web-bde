import { Avatar, Typography } from "@mui/material";
import { User } from "~/models/User";

export default function UserDisplay({ user }: { user: User }) {
  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "10px" }}>
        {user.pseudo}
      </Typography>
      <Avatar
        variant="rounded"
        alt={user.name}
        src=""
        sx={{ width: 256, height: 256 }}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Name : {user.name}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Surname : {user.surname}</b>
      </Typography>
      <Typography variant="h5" style={{ marginTop: "10px" }}>
        <b>Wallet : {user.wallet}</b>
      </Typography>
    </div>
  );
}
