import { TextField, Button, Typography, Input, Avatar } from "@mui/material";
import { Form } from "remix";
import { UpdateUserFormData, User } from "~/models/User";

export default function UpdateUserForm({
  user,
  formData,
}: {
  user: User;
  formData?: UpdateUserFormData;
}) {
  return (
    <Form
      method="patch"
      action={`/user/${user.id}`}
      encType="multipart/form-data"
    >
      <input type="hidden" name="kind" value="user" />
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
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        error={Boolean(formData?.fieldsError?.wallet)}
        helperText={formData?.fieldsError?.wallet}
        name="wallet"
        defaultValue={formData?.fields?.wallet || user.wallet}
        label="Wallet"
        type="number"
        id="wallet"
      />
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
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
          required
          fullWidth
          name="surname"
          label="Surname"
          id="surname"
          defaultValue={formData?.fields?.surname || user.surname}
          error={Boolean(formData?.fieldsError?.surname)}
          helperText={formData?.fieldsError?.surname}
        />
      </div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Update User
      </Button>
    </Form>
  );
}