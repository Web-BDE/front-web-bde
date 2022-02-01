import { Link, LoaderFunction, useCatch, useLoaderData } from "remix";
import { requireUserId } from "~/services/authentication";
import { Challenge, getManyChallenge } from "~/services/challenges";

type LoaderData = {
  challenges?: Challenge[];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request, "/challenges");

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
