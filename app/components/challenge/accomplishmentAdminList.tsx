import { Accomplishment } from "~/models/Accomplishment";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";
import { Link } from "remix";

export default function AccomplishmentAdminList({
  accomplishments,
}: {
  accomplishments: Accomplishment[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">User</TableCell>
            <TableCell align="center">Challenge</TableCell>
            <TableCell align="center">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accomplishments.map(
            (accomplishment) =>
              accomplishment.user &&
              accomplishment.challenge && (
                <TableRow
                  key={accomplishment.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/accomplishments/${accomplishment.id}`}
                    >
                      <b>{accomplishment.user.pseudo}</b>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/accomplishments/${accomplishment.id}`}
                    >
                      <b>{accomplishment.challenge.name}</b>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/accomplishments/${accomplishment.id}`}
                    >
                      <b>
                        {new Date(
                          accomplishment.createdAt
                        ).toLocaleDateString()}
                      </b>
                    </Link>
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
