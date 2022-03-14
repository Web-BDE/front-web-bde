import { Button } from "@mui/material";
import { Form } from "remix";
import { Purchase } from "~/models/Purchase";

export default function RefundGoodiesForm({
  purchase,
}: {
  purchase: Purchase;
}) {
  return (
    <Form
      method="delete"
      action={`/goodies/${purchase.goodiesId || purchase.goodies?.id}?purchaseId=${purchase.id}`}
    >
      <input type="hidden" name="kind" value="purchase" />
      <Button size="small" type="submit" name="refund" id="refund" value="1">
        Refund
      </Button>
    </Form>
  );
}
