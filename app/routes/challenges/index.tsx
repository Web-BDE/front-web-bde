import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";

import { Challenge } from "~/models/Challenge";

import { requireUserInfo } from "~/services/authentication";
import { getManyChallenge } from "~/services/challenges";

type LoaderData = {
  challenges?: Challenge[];
};

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  await requireUserInfo(request, "/challenges");

  //Get challenges, if it throw an error we will cath it with Boundaries below
  const challenges = await getManyChallenge(request);

  return { challenges };
};

export default function Challenges() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Challenges</h1>
      {data.challenges?.map((challenge) => {
        return (
          <Link to={`/challenges/${challenge.id}`} key={challenge.id}>
            <h2>{challenge.name}</h2>
            <p>Reward : {challenge.reward}</p>
          </Link>
        );
      })}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 401:
      return (
        <div>
          <p>
            You must be <Link to="/login">logged in</Link> to see this data
          </p>
        </div>
      );
    case 403:
      return (
        <div>
          <p>Sorry, you don't have the rights to see this</p>
        </div>
      );
    default:
      <div>
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
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
