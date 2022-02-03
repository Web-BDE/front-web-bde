import {
  Link,
  LinksFunction,
  LoaderFunction,
  useCatch,
  useLoaderData,
} from "remix";

import { loadChallenges } from "~/controllers/challenge";
import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";

import { Challenge } from "~/models/Challenge";

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
  challenges?: Challenge[];
};

export const loader: LoaderFunction = async ({ request }) => {
  //Require user to be logged in
  await requireUserInfo(request, "/challenges");

  return await loadChallenges(request);
};

export default function Challenges() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="container">
      <h2>Challenges</h2>
      <div className="table">
        {/* For each challenge display the name and the reward */}
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
  return generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return generateUnexpectedError(error);
}
