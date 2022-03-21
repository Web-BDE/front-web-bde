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

export default function AccomplishmentList({
  accomplishments,
}: {
  accomplishments: Accomplishment[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Commentaire</TableCell>
            <TableCell align="center">État</TableCell>
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
                      <b>
                        {new Date(
                          accomplishment.createdAt
                        ).toLocaleDateString()}
                      </b>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/accomplishments/${accomplishment.id}`}
                    >
                      <b>
                        {accomplishment.comment.slice(0, 20) +
                          (accomplishment.comment.length >= 20 ? "..." : "")}
                      </b>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/accomplishments/${accomplishment.id}`}
                    >
                      <b>{accomplishment.validation}</b>
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
