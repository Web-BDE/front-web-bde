import {
  Link,
  LinksFunction,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import { loadGoodies } from "~/controllers/goodies";

import { Goodies } from "~/models/Goodies";

import { requireUserInfo } from "~/services/authentication";

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

  return await loadGoodies(request);
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
  return generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return generateUnexpectedError(error);
}
