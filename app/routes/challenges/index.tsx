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

import { Challenge } from "~/models/Challenge";

import { requireAuth } from "~/services/authentication";
import ChallengeGrid from "~/components/challenge/grids/challengeGrid";
import { getManyChallenge } from "~/services/challenges";
import { ContextData } from "~/root";

type LoaderData = {
  challengeResponse?: {
    error?: string;
    success?: string;
    challenges?: Challenge[];
  };
};

async function loadChallenges(token: string) {
  const { code, ...challengeResponse } = await getManyChallenge(token, 100, 0);

  return json({ challengeResponse } as LoaderData, code);
}

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  const token = await requireAuth(request, "/challenges");

  return await loadChallenges(token);
};

export default function Challenges() {
  const loaderData = useLoaderData<LoaderData>();

  const { API_URL } = useOutletContext<ContextData>();

  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Challenges
      </Typography>
      {generateAlert("error", loaderData.challengeResponse?.error)}
      {loaderData.challengeResponse?.challenges && (
        <ChallengeGrid
          API_URL={API_URL}
          challenges={loaderData.challengeResponse?.challenges}
        />
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
