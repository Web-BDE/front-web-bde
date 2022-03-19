import { Box, Button, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { DeleteGoodiesFormData, Goodies } from "~/models/Goodies";

export default function DeleteGoodiesForm({
  goodies,
  formData,
}: {
  goodies: Goodies;
  formData?: DeleteGoodiesFormData;
}) {
  const transition = useTransition();

  return (
    <Form method="delete" action={`/goodies/${goodies.id}`}>
      <input type="hidden" name="kind" value="goodies" />
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Supprimer
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
