import { Alert, Button } from "@mui/material";
import { Goodies } from "~/models/Goodies";

export type DeleteGoodiesFormData = {
  formError?: string;
  formSuccess?: string;
};

export default function DeleteGoodiesForm({
  goodies,
  formData,
}: {
  goodies: Goodies;
  formData?: DeleteGoodiesFormData;
}) {
  return (
    <div>
      {formData?.formError ? (
        <Alert severity="error">{formData?.formError}</Alert>
      ) : (
        ""
      )}
      {formData?.formSuccess ? (
        <Alert severity="success">{formData?.formSuccess}</Alert>
      ) : (
        ""
      )}
      <form method="post">
        <input type="hidden" name="method" value="delete-goodies" />
        <input
          type="hidden"
          name="goodiesId"
          value={goodies?.id}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Delete
        </Button>
      </form>
    </div>
  );
}