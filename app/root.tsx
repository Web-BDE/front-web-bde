import {
  Link,
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
import NavBar from "./components/navbar";
import { User } from "./models/User";
import { getSelft } from "./services/user";

import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";
import navbarstylesheet from "./styles/navbar.css";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
    {
      rel: "stylesheet",
      href: navbarstylesheet,
    },
  ];
};

type LoaderData = {
  userInfo?: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  let userInfo;
  try {
    userInfo = await getSelft(request);
  } catch {
    return {};
  }
  return { userInfo };
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar userInfo={data.userInfo} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 401:
      return (
        <div className="container">
          <p>
            You must be <Link to="/login">logged in</Link> to see this data
          </p>
        </div>
      );
    case 403:
      return (
        <div className="container">
          <p>Sorry, you don't have the rights to see this</p>
        </div>
      );
    default:
      <div className="container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <p>{caught.data}</p>
      </div>;
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
