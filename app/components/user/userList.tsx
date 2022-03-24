import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Paper,
  TableContainer,
  Avatar,
} from "@mui/material";
import { User } from "~/models/User";
import { Link } from "remix";

export default function UserList({
  users,
  API_URL,
}: {
  users: User[];
  API_URL?: string;
}) {
  let cheatCode = false;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Avatar</TableCell>
            <TableCell align="center">Pseudo</TableCell>
            <TableCell align="center">Prénom</TableCell>
            <TableCell align="center">Nom</TableCell>
            <TableCell align="center">Total de points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* <TableRow
              key={0}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link
                  to={`/users/7`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Avatar
                    src={`${
                      API_URL || "http://localhost:4000/"
                    }user/avatar/${"e2abfc1c697dda9c0c60e5e8f026544a7788a1bff29e4b269647295c15931e3d2b624fb2a4b990fae96bab3fd3b3cd9a"}`}
                    alt={"Flo"}
                    sx={{ width: 150, height: 150 }}
                    style={{ margin: "auto" }}
                  />
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/7`}
                >
                  <b>{"Flo"}</b>
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/7`}
                >
                  <b>{"Florent"}</b>
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/7`}
                >
                  <b>{"Hugovieux"}</b>
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/7`}
                >
                  <b>{99999999}</b>
                </Link>
              </TableCell>
            </TableRow> */}
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link
                  to={`/users/${user.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Avatar
                    src={`${API_URL || "http://localhost:4000/"}user/avatar/${
                      user.avatarId
                    }`}
                    alt={user.pseudo}
                    sx={{ width: 150, height: 150 }}
                    style={{ margin: "auto" }}
                  />
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/${user.id}`}
                >
                  <b>{user.pseudo}</b>
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/${user.id}`}
                >
                  <b>{user.surname}</b>
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/${user.id}`}
                >
                  <b>{user.name}</b>
                </Link>
              </TableCell>
              <TableCell align="center">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/${user.id}`}
                >
                  <b>{user.totalEarnedPoints}</b>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
