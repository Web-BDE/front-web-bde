import { LinksFunction } from "remix";
import { Accomplishment } from "~/models/Accomplishment";

type ActionData = {
  validateChallenge?: {
    validationError?: string;
  };
};

type LoaderData = {
  accomplishments?: Accomplishment[];
  accomplishmentError?: string;
};

export default function AccomplishmentsAdmin({
  loaderData,
  actionData,
}: {
  loaderData: LoaderData;
  actionData?: ActionData;
}) {
  return (
    <div>
      <h2>Accomplishments to validate</h2>
      <p>{loaderData.accomplishmentError}</p>
      <p>{actionData?.validateChallenge?.validationError}</p>
      <div className="table">
        {loaderData.accomplishments
          ?.filter((accomplishment) => {
            return !accomplishment.validation;
          })
          .sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          })
          .map((accomplishment) => {
            return (
              <div key={accomplishment.id}>
                <p>{accomplishment.proof}</p>
                <p>Created : {accomplishment.createdAt}</p>
                <form method="post">
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={"/challenges/admin"}
                  />
                  <input
                    type="hidden"
                    name="accomplishmentId"
                    value={accomplishment.id}
                  />
                  <button type="submit" name="validation" value="1">
                    Validate
                  </button>
                  <button type="submit" name="validation" value="-1">
                    Refuse
                  </button>
                </form>
              </div>
            );
          })}
      </div>
    </div>
  );
}
