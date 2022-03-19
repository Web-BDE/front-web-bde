import {
  TextField,
  Button,
  Typography,
  Input,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Box } from "@mui/system";
import { Form, useTransition } from "remix";
import { UpdateUserFormData, User } from "~/models/User";

export default function UpdateUserForm({
  user,
  formData,
  API_URL,
}: {
  user: User;
  formData?: UpdateUserFormData;
  API_URL?: string;
}) {
  const transition = useTransition();

  return (
    <Form
      method="patch"
      action={`/users/${user.id}`}
      encType="multipart/form-data"
    >
      <input type="hidden" name="kind" value="user" />
      <Avatar
        src={`${API_EXTERNAL_URL || "http://localhost:4000/"}user/avatar/${
          user.avatarId
        }`}
        alt={user.pseudo}
        sx={{ width: 300, height: 300 }}
        style={{ margin: "auto" }}
      />
      <div style={{ textAlign: "center" }}>
        <input
          required
          autoComplete="avatar"
          accept="image/*"
          type="file"
          name="avatar"
          id="avatar"
        />
      </div>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="pseudo"
        error={Boolean(formData?.fieldsError?.pseudo)}
        helperText={formData?.fieldsError?.pseudo}
        label="Pseudo"
        name="pseudo"
        autoComplete="pseudo"
        defaultValue={formData?.fields?.pseudo || user.pseudo}
        autoFocus
      />
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="name"
          label="Name"
          id="name"
          defaultValue={formData?.fields?.name || user.name}
          error={Boolean(formData?.fieldsError?.name)}
          helperText={formData?.fieldsError?.name}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="surname"
          label="Surname"
          id="surname"
          defaultValue={formData?.fields?.surname || user.surname}
          error={Boolean(formData?.fieldsError?.surname)}
          helperText={formData?.fieldsError?.surname}
        />
      </div>
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="wallet"
          label="Wallet"
          id="wallet"
          type="number"
          defaultValue={formData?.fields?.wallet || user.wallet}
          error={Boolean(formData?.fieldsError?.wallet)}
          helperText={formData?.fieldsError?.wallet}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="privilege"
          label="Privilege"
          type="number"
          id="privilege"
          defaultValue={formData?.fields?.privilege || user.privilege}
          error={Boolean(formData?.fieldsError?.privilege)}
          helperText={formData?.fieldsError?.privilege}
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
          Update
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
