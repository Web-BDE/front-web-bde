import { Box, Button, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import {
  Accomplishment,
  DeleteAccomplishmentFormData,
} from "~/models/Accomplishment";

export default function DeleteAccomplishmentForm({
  accomplishment,
  formData,
}: {
  accomplishment: Accomplishment;
  formData?: DeleteAccomplishmentFormData;
}) {
  const transition = useTransition();

  return (
    <Form
      method="delete"
      action={`/challenges/${
        accomplishment.challengeId || accomplishment.challenge?.id
      }?accomplishmentId=${accomplishment.id}`}
    >
      <input type="hidden" name="kind" value="accomplishment" />
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Delete
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
