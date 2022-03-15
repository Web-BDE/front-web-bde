import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import NavBar from "./components/navBar";
import { User } from "./models/User";
import { getSelft } from "./services/user";

import { generateExpectedError, generateUnexpectedError } from "./utils/error";
import { tryGetToken } from "./services/authentication";
import { Container } from "@mui/material";

export const meta: MetaFunction = () => {
  return { title: "Web BDE" };
};

export const links: LinksFunction = () => {
  return [
    //MUI stylesheets
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    },
  ];
};

type LoaderData = {
  userInfo?: User;
};

export type ContextData = {
  userInfo?: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = await tryGetToken(request);

  if (token) {
    return { userInfo: (await getSelft(token))?.user };
  }

  return {};
};

export default function App() {
  const loaderData = useLoaderData<LoaderData>();
  const context: ContextData = { userInfo: loaderData.userInfo };
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar userInfo={loaderData.userInfo} />
        <Container style={{ marginTop: "100px", marginBottom: "100px" }}>
          <Outlet context={context} />
        </Container>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
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
