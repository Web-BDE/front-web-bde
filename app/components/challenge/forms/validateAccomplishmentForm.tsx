import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import {
  Accomplishment,
  ValidateAccomplishmentFormData,
} from "~/models/Accomplishment";

export default function ValidateAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: ValidateAccomplishmentFormData;
}) {
  const transition = useTransition();

  return (
    <Form
      style={{ display: "flex", justifyContent: "space-between" }}
      method="patch"
      action={`/challenges/admin?accomplishmentId=${accomplishment.id}`}
    >
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="refusedComment"
        label="Refuse refusedComment"
        name="refusedComment"
        autoComplete="refusedComment"
        autoFocus
        defaultValue={
          formData?.fields?.refusedComment || accomplishment.refusedComment
        }
        error={Boolean(formData?.fieldsError?.refusedComment)}
        helperText={formData?.fieldsError?.refusedComment}
      />
      <Box>
        <Button
          fullWidth
          type="submit"
          name="validation"
          id="validation"
          value="ACCEPTED"
        >
          Validate
        </Button>
        {transition.state === "submitting" && (
          <CircularProgress
            size={24}
            sx={{
              color: blue[500],
              position: "absolute",
              left: "50%",
              marginTop: "6px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
      <Box>
        <Button
          fullWidth
          color="error"
          type="submit"
          name="validation"
          value="REFUSED"
          id="validation"
        >
          Refuse
        </Button>
        {transition.state === "submitting" && (
          <CircularProgress
            size={24}
            sx={{
              color: blue[500],
              position: "absolute",
              left: "50%",
              marginTop: "6px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Form>
  );
}
