import {
  TextField,
  Button,
  Input,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { CreateGoodiesFormData } from "~/models/Goodies";

export default function CreateGoodiesForm({
  formData,
  redirectTo,
}: {
  formData?: CreateGoodiesFormData;
  redirectTo: string | null;
}) {
  const transition = useTransition();

  return (
    <Form method="put" action="/goodies/admin" encType="multipart/form-data">
      <Typography variant="h6" style={{ marginTop: "10px" }}>
        <b>Miniature</b>
      </Typography>
      <input
        required
        autoComplete="picture"
        accept="image/*"
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
        label="Nom"
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
        label="Description"
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
        label="Prix"
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
          label="Limite d'achat"
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
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Créer
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
    </Form>
  );
}
