import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  Button,
  CircularProgress,
  Container,
  Step,
  StepLabel,
  Stepper,
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

const steps = ["En attente", "En preparation", "En livraison", "Livré"];

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

  const [orderState, setOrderState] = useState<number>(1);
  const [dates, setDates] = useState<(Date | null)[]>([]);

  useEffect(() => {
    fetchEventSource(
      `https://back.polytech.iosus.fr/api/orders-tracking/${shortcode}/state`,
      {
        onmessage(event) {
          const data: Payload = JSON.parse(event.data);
          setOrderState(() => {
            switch (data.state) {
              case "waiting":
                return 1;
              case "in-preparation":
                return 2;
              case "in-transit":
                return 3;
              case "delivered":
                return 4;
              default:
                return 1;
            }
          });
          setDates(data.dates.map((d) => (d ? new Date(d) : null)));
        },
      }
    );
  }, [shortcode]);

  return (
    <Container maxWidth="md" sx={{ marginTop: "100px" }}>
      <Typography variant="h4">Allôs</Typography>
      {generateAlert("error", actionData?.error)}
      <Form method="post" action={`/allo/${shortcode}/`}>
        <div style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="shortcode"
            label="Chercher vos Allôs"
            name="shortcode"
            autoComplete="shortcode"
            autoFocus
            required
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
      <Box sx={{ width: "100%", marginTop: "50px" }}>
        <Stepper activeStep={orderState} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography>{label}</Typography>
                <Typography>{dates[index]?.toLocaleTimeString()}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
};

export default OrderDisplay;
