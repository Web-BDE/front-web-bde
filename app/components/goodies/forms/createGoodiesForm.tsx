import { TextField, Button, Input } from "@mui/material";
import { Form } from "remix";
import { CreateGoodiesFormData } from "~/models/Goodies";

export default function CreateGoodiesForm({
  formData,
  redirectTo,
}: {
  formData?: CreateGoodiesFormData;
  redirectTo: string | null;
}) {
  return (
    <Form method="put" action="/goodies/admin" encType="multipart/form-data">
      <Input
        margin="dense"
        required
        fullWidth
        autoComplete="picture"
        autoFocus
        defaultValue={formData?.fields?.picture}
        error={Boolean(formData?.fieldsError?.picture)}
        type="file"
        name="picture"
        id="picture"
      />
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
      <div style={{ display: "flex" }}>
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
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="stock"
          label="Stock"
          type="number"
          id="stock"
          defaultValue={formData?.fields?.stock || 1}
          error={Boolean(formData?.fieldsError?.stock)}
          helperText={formData?.fieldsError?.stock}
        />
      </div>
      <Button type="submit" fullWidth variant="contained" color="primary">
        Create Goodies
      </Button>
    </Form>
  );
}
