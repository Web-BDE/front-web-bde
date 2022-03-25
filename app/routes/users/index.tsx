import { CircularProgress, Container, Pagination as PaginationMui, Typography } from "@mui/material";

import {
  ActionFunction,
  json,
  LoaderFunction,
  useCatch,
  useLoaderData,
  useOutletContext,
  useSubmit,
  useTransition,
} from "remix";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import UserList from "~/components/user/userList";
import { requireAuth } from "~/services/authentication";
import { User } from "~/models/User";
import { getManyUser, getUserCount } from "~/services/user";
import { ContextData } from "~/root";
import { blue } from "@mui/material/colors";
import { Pagination } from "~/utils/pagination";

type LoaderData = {
  userResponse?: {
    error?: string;
    data?: Pagination<User>;
    success?: string;
  };
};

const rowPerPage = 100;

async function loadUsers(token: string, page: number = 0) {
  const userResponse = await getManyUser(token, rowPerPage, page * rowPerPage);
  const countResponse = await getUserCount(token);

  if (userResponse.error) {
    return json(
      { userResponse: { error: userResponse.error } } as LoaderData,
      userResponse.code
    );
  }

  if (countResponse.error) {
    return json(
      { userResponse: { error: countResponse.error } } as LoaderData,
      countResponse.code
    );
  }

  return json({
    userResponse: {
      pagination: {
        page: page,
        count: countResponse.count,
        items: userResponse.users,
      }
    }
  } as LoaderData, Math.max(userResponse.code || 200, countResponse.code || 200));
}

export const action: ActionFunction = async ({ request }) => {
  const token = await requireAuth(request, "/users");
  const formData = await request.formData();
  const page = Number(formData.get("page"));

  if (isNaN(page)) {
    return json({ challengeResponse: { error: "Bad form data: page must be a number" } }, 400)
  }

  return await loadUsers(token, page);
}

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/users");

  return await loadUsers(token);
};

export default function Users() {
  const loaderData = useLoaderData<LoaderData>();
  const { API_URL } = useOutletContext<ContextData>();
  const transition = useTransition();
  const submit = useSubmit();

  const handleChangePage = async (event: React.ChangeEvent<unknown>, value: number) => {
    const formData = new FormData();
    //Page starts from 1 instead of 0 for MUI Pagination component
    formData.append("page", (value - 1).toString());
    submit(formData);
  };

  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Leaderboard
      </Typography>
      {generateAlert("error", loaderData.userResponse?.error)}
      {generateAlert(
        "info",
        loaderData.userResponse?.success &&
          (!loaderData.userResponse?.data?.items ||
            loaderData.userResponse?.data?.items.length === 0)
          ? "Il n'y a aucun utilisateur à afficher"
          : undefined
      )}
      {loaderData.userResponse?.data?.items &&
        loaderData.userResponse?.data?.items.length !== 0 && (
          <div style={{ marginTop: "50px" }}>
            <UserList
              API_URL={API_URL}
              users={loaderData.userResponse?.data?.items.sort(
                (a, b) => b.totalEarnedPoints - a.totalEarnedPoints
              )}
            />
          </div>
        )}
      {transition.state === "submitting" && (
        <CircularProgress
          size={36}
          sx={{
            color: blue[500],
            position: "absolute",
            left: "50%",
            marginTop: "18px",
            marginLeft: "-18px",
          }}
        />
      )}
      <PaginationMui
        count={Math.ceil((loaderData.userResponse?.data?.count || 0) / rowPerPage)}
        page={(loaderData.userResponse?.data?.page || 0) + 1}
        onChange={handleChangePage}
      />
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
