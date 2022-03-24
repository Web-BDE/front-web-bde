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

import { Challenge } from "~/models/Challenge";

import { requireAuth } from "~/services/authentication";
import ChallengeGrid from "~/components/challenge/grids/challengeGrid";
import { getChallengeCount, getManyChallenge } from "~/services/challenges";
import { ContextData } from "~/root";
import { blue } from "@mui/material/colors";
import { Pagination } from "~/utils/pagination";

type LoaderData = {
  challengeResponse?: {
    data?: Pagination<Challenge>;
    error?: string;
    success?: string;
  };
};

const rowPerPage = 100;

async function loadChallenges(token: string, page: number = 0) {
  const challengeResponse = await getManyChallenge(token, rowPerPage, page * rowPerPage);
  const countResponse = await getChallengeCount(token);

  if (challengeResponse.error) {
    return json(
      { challengeResponse: { error: challengeResponse.error } } as LoaderData,
      challengeResponse.code
    );
  }

  if (countResponse.error) {
    return json(
      { challengeResponse: { error: countResponse.error } } as LoaderData,
      countResponse.code
    );
  }

  return json({
    challengeResponse: {
      pagination: {
        page: page,
        count: countResponse.count,
        items: challengeResponse.challenges
      }
    }
  } as LoaderData, Math.max(challengeResponse.code || 200, countResponse.code || 200));
}

export const action: ActionFunction = async ({ request }) => {
  const token = await requireAuth(request, "/challenges");
  const formData = await request.formData();
  const page = Number(formData.get("page"));

  if (isNaN(page)) {
    return json({ challengeResponse: { error: "Bad form data: page must be a number" } }, 400)
  }

  return await loadChallenges(token, page);
}

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  const token = await requireAuth(request, "/challenges");

  return await loadChallenges(token);
};

export default function Challenges() {
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
        Liste des Défis
      </Typography>
      {generateAlert("error", loaderData.challengeResponse?.error)}
      {generateAlert(
        "info",
        loaderData.challengeResponse?.success &&
          (!loaderData.challengeResponse?.data?.items ||
            loaderData.challengeResponse?.data?.items.length === 0)
          ? "Il n'y a aucun challenge pour l'instant"
          : undefined
      )}
      {loaderData.challengeResponse?.data?.items &&
        loaderData.challengeResponse?.data?.items.length !== 0 && (
          <ChallengeGrid
            API_URL={API_URL}
            challenges={loaderData.challengeResponse?.data?.items}
          />
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
        count={Math.ceil((loaderData.challengeResponse?.data?.count || 0) / rowPerPage)}
        page={(loaderData.challengeResponse?.data?.page || 0) + 1}
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
