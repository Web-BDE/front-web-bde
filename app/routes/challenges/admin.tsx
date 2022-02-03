import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
  useLoaderData,
  useSearchParams,
} from "remix";

import { Accomplishment } from "~/models/Accomplishment";

import { requireUserInfo } from "~/services/authentication";

import AccomplishmentsAdmin from "~/components/accomplishmentsAdmin";

import contentDisplayStylesheet from "../../styles/contentdisplay.css";

import {
  generateExpectedError,
  generateUnexpectedError,
} from "~/controllers/error";
import {
  handleValidateAccomplishment,
  loadAccomplishments,
} from "~/controllers/accomplishment";
import { handleChallengeCreation } from "~/controllers/challenge";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: contentDisplayStylesheet,
    },
  ];
};

type ActionData = {
  createChallenge?: {
    formError?: string;
    fieldsError?: {
      name?: string;
      description?: string;
      reward?: string;
    };
    fields?: {
      name: string;
      description?: string;
      reward: number;
    };
  };
  validateChallenge?: {
    validationError?: string;
  };
};

type LoaderData = {
  accomplishments?: Accomplishment[];
  accomplishmentError?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  //User need to be logged in
  await requireUserInfo(request, `/challenges/admin`);

  const accomplishments = await loadAccomplishments(request);

  return accomplishments;
};

export const action: ActionFunction = async ({ request }) => {
  //User need to be logged in
  await requireUserInfo(request, `/challenges/admin`);

  //Declare all fields
  const form = await request.formData();
  const redirectTo = form.get("redirectTo");
  const method = form.get("methor");
  //Validation fields
  const validation = form.get("validation");
  const accomplishmentId = form.get("accomplishmentId");
  //Challenge creation fields
  const name = form.get("name");
  const description = form.get("description");
  const reward = form.get("reward");

  //Redirection undefined, should never happend
  if (typeof redirectTo !== "string") {
    return json(
      {
        createChallenge: { formError: "There was an error, please try again" },
      },
      400
    );
  }

  //Validation request
  switch (method) {
    case "validate-accomplishment":
      //Should never happend
      if (
        typeof validation !== "string" ||
        typeof accomplishmentId !== "string"
      ) {
        return json(
          {
            validateChallenge: {
              validationError: "There was an error, please try again",
            },
          },
          400
        );
      }

      await handleValidateAccomplishment(
        request,
        validation,
        parseInt(accomplishmentId)
      );

      return json({
        validateChallenge: { validationSuccess: "Challenge Validated" },
      });

    case "create-challenge":
      //Check for undefined values
      if (
        typeof name !== "string" ||
        (typeof description !== "string" &&
          typeof description !== "undefined") ||
        typeof reward !== "string"
      ) {
        return json({
          createChallenge: { formError: "You must fill all the fields" },
        });
      }

      await handleChallengeCreation(
        request,
        name,
        description,
        parseInt(reward)
      );

      return redirect(redirectTo);
  }

  return redirect(redirectTo);
};

export default function ChallengesAdmin() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData<LoaderData>();

  console.log(loaderData);

  return (
    <div className="container">
      <h2>Challenges Admin</h2>
      <form method="post">
        <span>{actionData?.createChallenge?.formError}</span>
        {/* Hidden input used to redirect user to the page where he was before */}
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") || "/challenges"}
        />
        <input type="hidden" name="method" value="create-challenge" />
        {/* Name input */}
        <div>
          <div>
            <label htmlFor="name-input">Name</label>
          </div>
          <input
            type="text"
            name="name"
            id="name-input"
            defaultValue={actionData?.createChallenge?.fields?.name}
          />
          <span>{actionData?.createChallenge?.fieldsError?.name}</span>
        </div>
        {/* Description input */}
        <div>
          <div>
            <label htmlFor="description-input">Description</label>
          </div>
          <input
            type="text"
            name="description"
            id="description-input"
            defaultValue={actionData?.createChallenge?.fields?.description}
          />
          <span>{actionData?.createChallenge?.fieldsError?.description}</span>
        </div>
        {/* Reward input */}
        <div>
          <div>
            <label htmlFor="reward-input">Reward</label>
          </div>
          <input
            type="number"
            name="reward"
            id="reward-input"
            min="0"
            defaultValue={actionData?.createChallenge?.fields?.reward || 0}
          />
          <span>{actionData?.createChallenge?.fieldsError?.reward}</span>
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* Display a list of accomplishments that need to be validated */}
      <AccomplishmentsAdmin loaderData={loaderData} actionData={actionData} />
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  generateExpectedError(caught);
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  generateUnexpectedError(error);
}
