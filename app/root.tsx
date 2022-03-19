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
import { BottomNavigation, Container, createTheme, CssBaseline, ThemeOptions } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

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
  API_URL?: string;
};

export type ContextData = {
  userInfo?: User;
  API_URL?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = await tryGetToken(request);

  if (token) {
    return {
      userInfo: (await getSelft(token))?.user,
      API_URL: process.env["API_URL"],
    } as LoaderData;
  }

  return { API_URL: process.env["API_URL"] } as LoaderData;
};

export default function App() {
  const loaderData = useLoaderData<LoaderData>();
  const context: ContextData = {
    userInfo: loaderData.userInfo,
    API_URL: loaderData.API_URL,
  };
  const theme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#552516',
      },
      secondary: {
        main: '#552516',
      },
      background: {
        default: '#E5DECE',
        paper: '#E5DECE',
      },
      text: {
        primary: '#552516',
        secondary: '#552516',
        disabled: '#552516',
        hint: '#552516',
      },
      divider: '#552516',

    },
    typography: {
      fontFamily: '"Petrona"',
      h1: {
        fontFamily: '"Pirata One"',
      },
      h2: {
        fontFamily: '"Pirata One"',
      },
      h3: {
        fontFamily: '"Pirata One"',
      },
      h4: {
        fontFamily: '"Pirata One"',
      },
      h5: {
        fontFamily: '"Pirata One"',
      },
      h6: {
        fontFamily: '"Pirata One"',
      },
      button: {
        fontFamily: '"Pirata One"',
        fontSize: 20,
      },
    },
  } as ThemeOptions);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Flibustech</title>
        <link href="/assets/styles/main.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Petrona&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Pirata+One&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar userInfo={loaderData.userInfo} API_URL={loaderData.API_URL} />
          <Outlet context={context} />
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
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
