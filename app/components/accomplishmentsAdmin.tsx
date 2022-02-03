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
      <span>{loaderData.accomplishmentError}</span>
      <span>{actionData?.validateChallenge?.validationError}</span>
      <div className="table">
        {/* Load all accomplishment in pending state */}
        {loaderData.accomplishments
          ?.filter((accomplishment) => {
            return !accomplishment.validation;
          })
          //Sort by oldest
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
                  {/* Method hidden input */}
                  <input
                    type="hidden"
                    name="method"
                    value="validate-accomplishment"
                  />
                  {/* Redirection input */}
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={"/challenges/admin"}
                  />
                  {/* Hiddent input to pass accomplishment id to form */}
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
