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

import { requireAuth } from "~/services/authentication";
import { getGoodiesCount, getManyGoodies } from "~/services/goodies";
import GoodiesGrid from "~/components/goodies/grids/goodiesGrid";
import { Goodies } from "~/models/Goodies";
import { ContextData } from "~/root";
import { blue } from "@mui/material/colors";
import { Pagination } from "~/utils/pagination";

type LoaderData = {
  goodiesResponse?: {
    error?: string;
    data?: Pagination<Goodies>;
    success?: string
  };
};

const rowPerPage = 100;

async function loadGoodies(token: string, page: number = 0) {
  const goodiesResponse = await getManyGoodies(token, rowPerPage, page * rowPerPage);
  const countResponse = await getGoodiesCount(token);

  if (goodiesResponse.error) {
    return json(
      { goodiesResponse: { error: goodiesResponse.error } } as LoaderData,
      goodiesResponse.code
    );
  }

  if (countResponse.error) {
    return json(
      { goodiesResponse: { error: countResponse.error } } as LoaderData,
      countResponse.code
    );
  }

  return json({
    goodiesResponse: {
      pagination: {
        page: page,
        count: countResponse.count,
        items: goodiesResponse.goodies,
      }
    }
  } as LoaderData, Math.max(goodiesResponse.code || 200, countResponse.code || 200));
}

export const action: ActionFunction = async ({ request }) => {
  const token = await requireAuth(request, "/goodies");
  const formData = await request.formData();
  const page = Number(formData.get("page"));

  if (isNaN(page)) {
    return json({ challengeResponse: { error: "Bad form data: page must be a number" } }, 400)
  }

  return await loadGoodies(token, page);
}

//Function that handle GET requests
export const loader: LoaderFunction = async ({ request }) => {
  const token = await requireAuth(request, "/goodies");

  return await loadGoodies(token);
};

export default function Shop() {
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
        Boutique
      </Typography>
      {generateAlert("error", loaderData.goodiesResponse?.error)}
      {generateAlert(
        "info",
        loaderData.goodiesResponse?.success &&
          (!loaderData.goodiesResponse?.data?.items ||
            loaderData.goodiesResponse?.data?.items.length === 0)
          ? "Il n'y a pas de goodies pour l'instant"
          : undefined
      )}
      {loaderData.goodiesResponse?.data?.items &&
        loaderData.goodiesResponse?.data?.items.length !== 0 && (
          <GoodiesGrid
            API_URL={API_URL}
            goodies={loaderData.goodiesResponse?.data?.items}
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
        count={Math.ceil((loaderData.goodiesResponse?.data?.count || 0) / rowPerPage)}
        page={(loaderData.goodiesResponse?.data?.page || 0) + 1}
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
