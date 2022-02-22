import { Container } from "@mui/material";

import { json, LoaderFunction, useCatch, useLoaderData } from "remix";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import { Challenge } from "~/models/Challenge";

import { requireAuth } from "~/services/authentication";
import ChallengeGrid from "~/components/challenge/challengeGrid";
import { getManyChallenge } from "~/services/challenges";
import { APIError } from "~/utils/axios";

async function loadChallenges(token: string) {
  //Get challenges, if it throw an error we will cath it with Boundaries below
  let challenges;
  try {
    challenges = (await getManyChallenge(token, 100))?.challenges;
  } catch (err) {
    if (err instanceof APIError) {
      throw json(err.error.message, err.code);
    }
    throw err;
  }
  return { challenges };
}

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  const token = await requireAuth(request, "/challenges");

  return await loadChallenges(token);
};

export default function Challenges() {
  const loaderData = useLoaderData<{ challenges: Challenge[] }>();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <ChallengeGrid challenges={loaderData.challenges} />
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
