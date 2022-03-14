import { Button } from "@mui/material";
import { Form } from "remix";
import { Purchase } from "~/models/Purchase";

export default function DeliverGoodiesForm({
  purchase,
}: {
  purchase: Purchase;
}) {
  return (
    //TODO mark as delivered
    <Form
      method="patch"
      action={`/goodies/${purchase.goodiesId || purchase.goodies?.id}?purchaseId=${purchase.id}`}
    >
      <input type="hidden" name="kind" value="purchase" />
      <input type="hidden" name="delivered" value="true" />
      <Button size="small" type="submit" name="refund" id="refund" value="1">
        Mark as delivered
      </Button>
    </Form>
  );
}
