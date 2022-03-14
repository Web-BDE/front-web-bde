import { Button } from "@mui/material";
import { Form } from "remix";
import { Accomplishment } from "~/models/Accomplishment";

export default function ValidateAccomplishmentForm({
  accomplishment,
}: {
  accomplishment: Accomplishment;
}) {
  return (
    <Form
      style={{ display: "flex", justifyContent: "space-between" }}
      method="patch"
      action={`/challenges/admin?accomplishmentId=${accomplishment.id}`}
    >
      <Button
        size="small"
        type="submit"
        name="validation"
        id="validation"
        value="ACCEPTED"
      >
        Validate
      </Button>
      <Button
        size="small"
        type="submit"
        name="validation"
        value="REFUSED"
        id="validation"
      >
        Refuse
      </Button>
    </Form>
  );
}
