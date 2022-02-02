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

function displayValidation(state: number | null, formData?: FormData) {
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
        <form method="post">
          <p>{formData?.formError || formData?.formSuccess}</p>
          <input type="hidden" name="method" value="update" />
          <div>
            <label htmlFor="proof-input">Proof</label>
            <input type="text" name="proof" id="proof-input" />
            <p>{formData?.fieldsError?.proof}</p>
          </div>
          <button type="submit">Submit</button>
        </form>
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
      <h1>Your accomplishments</h1>
      {accomplishments.accomplishments
        ?.filter((accomplishment) => {
          return (
            accomplishment.userId === accomplishments.userId &&
            accomplishment.challengeId === accomplishments.challengeId
          );
        })
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
              {displayValidation(accomplishment.validation, formData)}
            </div>
          );
        })}
    </div>
  );
}
