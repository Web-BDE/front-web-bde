import {
  json,
  Link,
  LinksFunction,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";

import { Goodies } from "~/models/Goodies";

import { requireUserInfo } from "~/services/authentication";
import { getManyGoodies } from "~/services/goodies";
import { APIError } from "~/utils/axios";

import contentDisplayStylesheet from "../../styles/contentdisplay.css";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: contentDisplayStylesheet,
    },
  ];
};

type LoaderData = {
  goodies?: Goodies[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserInfo(request, "/shop");

  let goodies;
  try {
    goodies = await getManyGoodies(request);
  } catch (err) {
    if (err instanceof APIError) {
      throw json(err.error.message, err.code);
    }
    throw err;
  }

  return { goodies: goodies };
};

export default function Shop() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="container">
      <h2>Shop</h2>
      <div className="table">
        {data.goodies?.map((goodie) => {
          return (
            <Link to={`/shop/${goodie.id}`} key={goodie.id}>
              <h3>{goodie.name}</h3>
              <p>Price : {goodie.price}</p>
            </Link>
          );
        })}
      </div>
    </div>
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
