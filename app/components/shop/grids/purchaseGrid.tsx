import { Alert, Container, Grid } from "@mui/material";
import { useContext } from "react";
import { Purchase } from "~/models/Purchase";
import { UserContext } from "../../userContext";
import PurchaseTile, { RefundPurchaseFormData } from "./purchaseTile";

export type PurchaseData = {
  purchases?: Purchase[];
  error?: string;
};

export default function PurchasesGrid({
  purchases,
  formData,
}: {
  purchases: PurchaseData;
  formData?: RefundPurchaseFormData;
}) {
  const userInfo = useContext(UserContext);

  return (
    <Container style={{ marginBottom: "50px" }}>
      {purchases.error ? <Alert severity="error">{purchases.error}</Alert> : ""}
      <Grid
        textAlign="center"
        container
        style={{ marginTop: "10px" }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {/* Display the user's purchases */}
        {purchases.purchases?.map((purchase) => {
          {
            return (
              <Grid item key={purchase.id}>
                <PurchaseTile
                  purchase={purchase}
                  formData={formData}
                  userPrivilege={userInfo?.privilege}
                />
              </Grid>
            );
          }
        })}
      </Grid>
    </Container>
  );
}
