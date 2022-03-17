import { Container, Typography } from "@mui/material";

import {
  json,
  LoaderFunction,
  useCatch,
  useLoaderData,
  useOutletContext,
} from "remix";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import UserList from "~/components/user/userList";
import { requireAuth } from "~/services/authentication";
import { User } from "~/models/User";
import { getManyUser } from "~/services/user";
import { ContextData } from "~/root";

type LoaderData = {
  userResponse?: { error?: string; users?: User[]; success?: string };
};

async function loadUsers(token: string) {
  const { code, ...userResponse } = await getManyUser(token, 100);

  return json({ userResponse } as LoaderData, code);
}

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/goodies");

  return await loadUsers(token);
};

export default function Users() {
  const loaderData = useLoaderData<LoaderData>();

  const { API_URL } = useOutletContext<ContextData>();

  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Typography style={{ textAlign: "center" }} variant="h2">
        User List
      </Typography>
      {generateAlert("error", loaderData.userResponse?.error)}
      {loaderData.userResponse?.users && (
        <div style={{ marginTop: "50px" }}>
          <UserList
            API_URL={API_URL}
            users={loaderData.userResponse.users.sort(
              (a, b) => b.totalEarnedPoints - a.totalEarnedPoints
            )}
          />
        </div>
      )}
    </Container>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return generateUnexpectedError(error);
}
