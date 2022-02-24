import { TextField, Button } from "@mui/material";
import { CreateGoodiesFormData } from "~/models/Goodies";

export default function CreateGoodiesForm({
  formData,
  redirectTo,
}: {
  formData?: CreateGoodiesFormData;
  redirectTo: string | null;
}) {
  return (
    <form method="post">
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
        defaultValue={formData?.fields?.name}
        error={Boolean(formData?.fieldsError?.name)}
        helperText={formData?.fieldsError?.name}
      />
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name="description"
        label="description"
        id="description"
        defaultValue={formData?.fields?.description}
        error={Boolean(formData?.fieldsError?.description)}
        helperText={formData?.fieldsError?.description}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="price"
        label="price"
        type="number"
        id="price"
        defaultValue={formData?.fields?.price || 0}
        error={Boolean(formData?.fieldsError?.price)}
        helperText={formData?.fieldsError?.price}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="buy-limit"
        label="Buy Limit"
        type="number"
        id="buy-limit"
        defaultValue={formData?.fields?.buyLimit || 1}
        error={Boolean(formData?.fieldsError?.buyLimit)}
        helperText={formData?.fieldsError?.buyLimit}
      />
      <Button type="submit" fullWidth variant="contained" color="primary">
        Create Goodies
      </Button>
    </form>
  );
}
