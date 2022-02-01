import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";

import { Goodies } from "~/models/Goodies";

import { requireUserInfo } from "~/services/authentication";
import { getManyGoodies } from "~/services/goodies";

type LoaderData = {
  goodies?: Goodies[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserInfo(request, "/shop");

  const goodies = await getManyGoodies(request);

  return { goodies: goodies };
};

export default function Shop() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Shop</h1>
      {data.goodies?.map((goodie) => {
        return (
          <Link to={`/shop/${goodie.id}`} key={goodie.id}>
            <h2>{goodie.name}</h2>
            <p>Price : {goodie.price}</p>
          </Link>
        );
      })}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <p>{caught.data}</p>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
