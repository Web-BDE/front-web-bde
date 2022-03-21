import { Box, Button, CircularProgress } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { Purchase } from "~/models/Purchase";

export default function RefundGoodiesForm({
  purchase,
}: {
  purchase: Purchase;
}) {
  const transition = useTransition();

  return (
    <Form
      method="delete"
      action={`/goodies/${
        purchase.goodiesId || purchase.goodies?.id
      }?purchaseId=${purchase.id}`}
    >
      <input type="hidden" name="kind" value="purchase" />
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          size="small"
          type="submit"
          name="refund"
          id="refund"
          value="1"
        >
          Rembourser
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
