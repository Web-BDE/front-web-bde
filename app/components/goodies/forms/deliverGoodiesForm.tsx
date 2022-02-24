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
      method="put"
      action={`/goodies/${purchase.goodiesId}?purchaseId=${purchase.id}`}
    >
      <input type="hidden" name="method" value="deliver" />
      <Button size="small" type="submit" name="refund" id="refund" value="1">
        Mark as delivered
      </Button>
    </Form>
  );
}
