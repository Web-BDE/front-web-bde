import { Container } from "@mui/material";

import { json, LoaderFunction, useCatch, useLoaderData } from "remix";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import { requireAuth } from "~/services/authentication";
import { getManyGoodies } from "~/services/goodies";
import GoodiesGrid from "~/components/shop/grids/goodiesGrid";
import { Goodies } from "~/models/Goodies";

type LoaderData = {
  goodiesResponse: { error?: string; goodies?: Goodies[]; message?: string };
};

async function loadGoodies(token: string) {
  const { code, ...goodiesResponse } = await getManyGoodies(token, 100, 0);

  //TODO : don't throw
  if (goodiesResponse.error) {
    throw json(goodiesResponse, code);
  }

  return json({ goodiesResponse: { goodiesResponse } } as LoaderData, code);
}

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/shop");

  return await loadGoodies(token);
};

export default function Shop() {
  const loaderData = useLoaderData<LoaderData>();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <GoodiesGrid goodies={loaderData.goodiesResponse.goodies} />
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
