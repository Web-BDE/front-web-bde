import { Container } from "@mui/material";

import { json, LoaderFunction, useCatch, useLoaderData } from "remix";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import { requireAuth } from "~/services/authentication";
import { getManyGoodies } from "~/services/goodies";
import { APIError } from "~/utils/axios";
import GoodiesGrid from "~/components/shop/goodiesGrid";
import { Goodies } from "~/models/Goodies";

async function loadGoodies(token: string) {
  let goodies;
  try {
    goodies = await getManyGoodies(token);
  } catch (err) {
    if (err instanceof APIError) {
      throw json(err.error.message, err.code);
    }
    throw err;
  }

  return goodies;
}

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/shop");

  return await loadGoodies(token);
};

export default function Shop() {
  const data = useLoaderData<Goodies[]>();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <GoodiesGrid goodies={data} />
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
