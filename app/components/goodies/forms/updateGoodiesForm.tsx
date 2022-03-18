import {
  TextField,
  Button,
  Typography,
  Input,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Form, useTransition } from "remix";
import { CreateGoodiesFormData, Goodies } from "~/models/Goodies";
import { User } from "~/models/User";

export default function UpdateGoodiesForm({
  goodies,
  formData,
  API_URL,
}: {
  goodies: Goodies;
  formData?: CreateGoodiesFormData;
  API_URL?: string;
}) {
  const transition = useTransition();

  return (
    <Form
      method="patch"
      action={`/goodies/${goodies.id}`}
      encType="multipart/form-data"
    >
      <input type="hidden" name="kind" value="goodies" />
      <Avatar
        variant="rounded"
        src={`${API_URL || "http://localhost:4000/"}goodies/picture/${
          goodies.imageId
        }`}
        alt={goodies.name}
        sx={{ width: "75%", height: "75%" }}
        style={{ margin: "auto" }}
      />
      <div style={{ textAlign: "center" }}>
        <input
          required
          autoComplete="picture"
          accept="image/*"
          type="file"
          name="picture"
          id="picture"
        />
      </div>
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
          defaultValue={formData?.fields?.buyLimit || goodies.buyLimit}
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
          defaultValue={formData?.fields?.stock || goodies.stock}
          error={Boolean(formData?.fieldsError?.stock)}
          helperText={formData?.fieldsError?.stock}
        />
      </div>
      <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
        Creation date : {new Date(goodies.createdAt).toLocaleDateString()}
      </Typography>
      {goodies.creator && (
        <Typography variant="h6" align="center" style={{ marginTop: "10px" }}>
          Creator : {goodies.creator.pseudo}
        </Typography>
      )}
      <Box>
        <Button
          disabled={transition.state === "submitting"}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Update Goodies
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
