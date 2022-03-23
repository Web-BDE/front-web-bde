import { Button, CircularProgress, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { Purchase } from "~/models/Purchase";

export default function DeliverGoodiesForm({
  purchase,
  delivered,
}: {
  purchase: Purchase;
  delivered: boolean;
}) {
  const transition = useTransition();
  return (
    <Form
      method="patch"
      action={`/goodies/${
        purchase.goodiesId || purchase.goodies?.id
      }?purchaseId=${purchase.id}`}
    >
      <input type="hidden" name="kind" value="purchase" />
      <input type="hidden" name="delivered" value="true" />
      <Box>
        {!delivered ? (
          <Button
            disabled={transition.state === "submitting"}
            size="small"
            type="submit"
            name="delivered"
            id="delivered"
            value="1"
          >
            Marquer comme livré
          </Button>
        ) : (
          <Button
            disabled={transition.state === "submitting"}
            size="small"
            type="submit"
            name="delivered"
            id="delivered"
            value="-1"
          >
            Marquer comme non livré
          </Button>
        )}
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
