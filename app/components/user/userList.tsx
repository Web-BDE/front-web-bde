import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Paper,
} from "@mui/material";
import { User } from "~/models/User";
import { Link } from "remix";

export default function UserList({ users }: { users: User[] }) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pseudo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>Total point earned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Link to={`/users/${item.id}`}>{item.pseudo}</Link>
                </TableCell>
                <TableCell>
                  <Link to={`/users/${item.id}`}>{item.name}</Link>
                </TableCell>
                <TableCell>
                  <Link to={`/users/${item.id}`}>{item.surname}</Link>
                </TableCell>
                <TableCell>
                  <Link to={`/users/${item.id}`}>{item.totalEarnedPoints}</Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter />
      </Table>
    </Paper>
  );
}
