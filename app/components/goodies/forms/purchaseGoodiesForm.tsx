import { Box, Button, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { Goodies } from "~/models/Goodies";
import { PurchaseGoodiesFormData } from "~/models/Purchase";

export default function PurchaseGoodiesForm({
  formData,
  goodies,
}: {
  goodies: Goodies;
  formData?: PurchaseGoodiesFormData;
}) {
  const transition = useTransition();

  return (
    <Form method="put" action={`/goodies/${goodies.id}`}>
      <input type="hidden" name="method" value="purchase" />
      <Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          name="purchase"
          value="purchase"
        >
          Acheter
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
