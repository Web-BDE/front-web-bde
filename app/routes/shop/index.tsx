import { Container } from "@mui/material";

import { LoaderFunction, useCatch, useLoaderData } from "remix";

import { generateExpectedError, generateUnexpectedError } from "~/utils/error";

import { requireAuth } from "~/services/authentication";
import { getManyGoodies } from "~/services/goodies";
import GoodiesGrid from "~/components/shop/goodiesGrid";
import { Goodies } from "~/models/Goodies";

async function loadGoodies(token: string) {
  const goodies = (await getManyGoodies(token))?.goodies;

  return { goodies };
}

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/shop");

  return await loadGoodies(token);
};

export default function Shop() {
  const loaderData = useLoaderData<{ goodies: Goodies[] }>();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <GoodiesGrid goodies={loaderData.goodies} />
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
