import { CircularProgress, Container, Typography } from "@mui/material";

import {
  json,
  LoaderFunction,
  useCatch,
  useLoaderData,
  useOutletContext,
  useTransition,
} from "remix";

import {
  generateAlert,
  generateExpectedError,
  generateUnexpectedError,
} from "~/utils/error";

import { requireAuth } from "~/services/authentication";
import { getManyGoodies } from "~/services/goodies";
import GoodiesGrid from "~/components/goodies/grids/goodiesGrid";
import { Goodies } from "~/models/Goodies";
import { ContextData } from "~/root";
import { blue } from "@mui/material/colors";

type LoaderData = {
  goodiesResponse?: { error?: string; goodies?: Goodies[]; success?: string };
};

async function loadGoodies(token: string) {
  const { code, ...goodiesResponse } = await getManyGoodies(token, 100, 0);

  return json({ goodiesResponse } as LoaderData, code);
}

//Function that handle GET resuests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/goodies");

  return await loadGoodies(token);
};

export default function Shop() {
  const loaderData = useLoaderData<LoaderData>();

  const { API_URL } = useOutletContext<ContextData>();

  const transition = useTransition();
  return (
    <Container component="main" style={{ marginTop: "50px" }}>
      <Typography style={{ textAlign: "center" }} variant="h2">
        Shop
      </Typography>
      {generateAlert("error", loaderData.goodiesResponse?.error)}
      {generateAlert(
        "info",
        loaderData.goodiesResponse?.success &&
          (!loaderData.goodiesResponse?.goodies ||
            loaderData.goodiesResponse.goodies.length === 0)
          ? "Il n'y a pas de goodies pour l'instant"
          : undefined
      )}
      {loaderData.goodiesResponse?.goodies &&
        loaderData.goodiesResponse.goodies.length !== 0 && (
          <GoodiesGrid
            API_URL={API_URL}
            goodies={loaderData.goodiesResponse.goodies}
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
