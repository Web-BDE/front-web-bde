import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { generateAlert } from "~/utils/error";

type ActionData = {
  error?: string;
  success?: string;
  formData?: {
    fields?: {
      shortcode: string;
    };
    fieldsError?: {
      shortcode?: string;
    };
  };
};

enum OrderState {
  WAITING = "waiting",
  IN_PREPARATION = "in-preparation",
  IN_TRANSIT = "in-transit",
  DELIVERED = "delivered",
}

interface Payload {
  state: OrderState;
  dates: (string | null)[]; // One date per possible state
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const shortcode = form.get("shortcode");

  if (typeof shortcode !== "string") {
    return json(
      { error: "Something went wrong, please try again" } as ActionData,
      400
    );
  }

  return redirect(`/allo/${shortcode}`);
};

const OrderDisplay = () => {
  const { shortcode } = useParams<{ shortcode: string }>();

  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  const [orderState, setOrderState] = useState<OrderState>(OrderState.WAITING);
  const [dates, setDates] = useState<(Date | null)[]>([]);

  useEffect(() => {
    fetchEventSource(
      `https://back.polytech.iosus.fr/api/orders-tracking/${shortcode}/state`,
      {
        onmessage(event) {
          const data: Payload = JSON.parse(event.data);
          setOrderState(data.state);
          setDates(data.dates.map((d) => (d ? new Date(d) : null)));
        },
      }
    );
  }, [shortcode]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Allôs</Typography>
      {generateAlert("error", actionData?.error)}
      <Form method="post" action={`/allo/${shortcode}/`}>
        <div style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="shortcode"
            label="Search for your Allô"
            name="shortcode"
            autoComplete="shortcode"
            autoFocus
            defaultValue={actionData?.formData?.fields?.shortcode}
            error={Boolean(actionData?.formData?.fieldsError?.shortcode)}
            helperText={actionData?.formData?.fieldsError?.shortcode}
            sx={{ marginRight: 5 }}
          />
          <Box margin="auto">
            <Button
              disabled={transition.state === "submitting"}
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: 100 }}
            >
              Search
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
        </div>
      </Form>
      {orderState}
      <p>
        {dates.map((date, index) => {
          if (date) {
            return <p key={index}>{date.toLocaleDateString()}</p>;
          }
        })}
      </p>
    </Container>
  );
};

export default OrderDisplay;
