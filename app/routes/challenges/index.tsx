import {
  json,
  Link,
  LinksFunction,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";

import { Challenge } from "~/models/Challenge";

import { requireUserInfo } from "~/services/authentication";
import { getManyChallenge } from "~/services/challenges";
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
  challenges?: Challenge[];
};

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  await requireUserInfo(request, "/challenges");

  //Get challenges, if it throw an error we will cath it with Boundaries below
  let challenges;
  try {
    challenges = await getManyChallenge(request);
  } catch (err) {
    if (err instanceof APIError) {
      throw json(err.error.message, err.code);
    }
    throw err;
  }

  return { challenges };
};

export default function Challenges() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="container">
      <h2>Challenges</h2>
      <div className="table">
        {data.challenges?.map((challenge) => {
          return (
            <Link to={`/challenges/${challenge.id}`} key={challenge.id}>
              <h3>{challenge.name}</h3>
              <p>Reward : {challenge.reward}</p>
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
