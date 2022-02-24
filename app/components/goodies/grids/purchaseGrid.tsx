import { Grid } from "@mui/material";
import { useContext } from "react";
import { useOutletContext } from "remix";
import { Purchase, RefundGoodiesFormData } from "~/models/Purchase";
import { ContextData } from "~/root";
import PurchaseTile from "./purchaseTile";

export default function PurchasesGrid({
  purchases,
  formData,
}: {
  purchases: Purchase[];
  formData?: RefundGoodiesFormData;
}) {
  const {userInfo} = useOutletContext<ContextData>();

  return (
    <Grid
      textAlign="center"
      container
      style={{ marginTop: "10px" }}
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 1, sm: 8, md: 12 }}
    >
      {/* Display the user's purchases */}
      {purchases.map((purchase) => {
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
  );
}
