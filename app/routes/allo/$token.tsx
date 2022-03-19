import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

enum OrderState {
  WAITING = "waiting",
  IN_PREPARATION = "in-preparation",
  IN_TRANSIT = "in-transit",
  DELIVERED = "delivered",
}

interface Payload {
  state: OrderState;
  date: (string | null)[]; // One date per possible state
}

const OrderDisplay = () => {
  const { token } = useParams<{ token: string }>();

  console.log(token);

  const [orderState, setOrderState] = useState<OrderState>(OrderState.WAITING);
  const [dates, setDates] = useState<(Date | null)[]>([]);

  useEffect(() => {
    fetchEventSource(
      `https://back.polytech.iosus.fr/api/orders-tracking/${token}/state`,
      {
        onmessage(event) {
          const data: Payload = JSON.parse(event.data);
          setOrderState(data.state);
          setDates(data.date.map((d) => (d ? new Date(d) : null)));
        },
      }
    );
  }, [token]);

  return (
    <div>
      {orderState} {dates}
    </div>
  );
};

export default OrderDisplay;
