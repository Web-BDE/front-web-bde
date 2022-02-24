import { TextField, Button, Typography, Alert } from "@mui/material";
import { Goodies } from "~/models/Goodies";
import { generateAlert } from "~/utils/error";

export type UpdateGoodiesFormData = {
  error?: string;
  success?: string;
  fieldsError?: {
    name?: string;
    description?: string;
    price?: string;
    buyLimit?: string;
  };
  fields?: {
    name: string;
    description: string;
    price: number;
    buyLimit: number;
  };
};

export default function UpdateGoodiesForm({
  goodies,
  formData,
}: {
  goodies: Goodies;
  formData?: UpdateGoodiesFormData;
}) {
  return (
    <div>
      {generateAlert("error", formData?.error)}
      {generateAlert("success", formData?.success)}
      <form method="post">
        {/* Hiddent input with the method that the Action function will have to handle */}
        <input type="hidden" name="method" value="update-goodies" />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          error={Boolean(formData?.fieldsError?.name)}
          helperText={formData?.fieldsError?.name}
          label="Name"
          name="name"
          autoComplete="name"
          defaultValue={formData?.fields?.name || goodies.name}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(formData?.fieldsError?.description)}
          helperText={formData?.fieldsError?.description}
          name="description"
          defaultValue={formData?.fields?.description || goodies.description}
          label="description"
          id="description"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(formData?.fieldsError?.price)}
          helperText={formData?.fieldsError?.price}
          name="price"
          defaultValue={formData?.fields?.price || goodies.price}
          label="price"
          type="number"
          id="price"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          error={Boolean(formData?.fieldsError?.buyLimit)}
          helperText={formData?.fieldsError?.buyLimit}
          name="buy-limit"
          defaultValue={formData?.fields?.buyLimit || goodies.buyLimit}
          label="buy-limit"
          type="number"
          id="buy-limit"
        />
        <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
          Creation date : {new Date(goodies.createdAt).toLocaleDateString()}
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Update Goodies
        </Button>
      </form>
    </div>
  );
}
