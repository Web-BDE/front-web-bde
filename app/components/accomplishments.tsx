import { Accomplishment } from "~/models/Accomplishment";

type FormData = {
  formError?: string;
  formSuccess?: string;
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
};

type AccomplishmentData = {
  accomplishments?: Accomplishment[];
  error?: string;
  userId: number;
  challengeId: number;
};

function displayValidation(
  state: number | null,
  formData?: FormData,
  accomplishmentId?: number
) {
  switch (state) {
    case 1:
      return (
        <p>
          <b>Accepted</b>
        </p>
      );
    case -1:
      return (
        <p>
          <b>Refused</b>
        </p>
      );
    default:
      return (
        <div>
          <form method="post">
            <span>{formData?.formError || formData?.formSuccess}</span>
            {/* Method hidden input */}
            <input type="hidden" name="method" value="update-accomplishment" />
            {/* Hiddent method to pass the accomplishment id to the form */}
            <input
              type="hidden"
              name="accomplishmentId"
              value={accomplishmentId}
            />
            {/* Proof input */}
            <div>
              <div>
                <label htmlFor="proof-input">Proof</label>
              </div>
              <input type="text" name="proof" id="proof-input" />
              <span>{formData?.fieldsError?.proof}</span>
            </div>
            <button type="submit">Update</button>
          </form>
          {/* Form to delete the accomplishment */}
          <form method="post">
            <input type="hidden" name="method" value="delete-accomplishment" />
            <input
              type="hidden"
              name="accomplishmentId"
              value={accomplishmentId}
            />
            <button type="submit">Delete</button>
          </form>
        </div>
      );
  }
}

export default function Accomplishments({
  accomplishments,
  formData,
}: {
  accomplishments: AccomplishmentData;
  formData?: FormData;
}) {
  return (
    <div>
      <h2>Your accomplishments</h2>
      {/* Display the user's accomplishments */}
      {accomplishments.accomplishments
        ?.filter((accomplishment) => {
          return (
            accomplishment.userId === accomplishments.userId &&
            accomplishment.challengeId === accomplishments.challengeId
          );
        })
        // sort by most recent
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
        .map((accomplishment) => {
          return (
            <div key={accomplishment.id}>
              <p>{accomplishment.proof}</p>
              <p>Created : {accomplishment.createdAt}</p>
              {displayValidation(
                accomplishment.validation,
                formData,
                accomplishment.id
              )}
            </div>
          );
        })}
    </div>
  );
}
