import axios from "axios";
import { redirect } from "remix";
import { User } from "~/models/User";
import { getToken, getUserId, logout } from "./authentication";

type RegisterForm = {
  email: string;
  password: string;
  pseudo: string;
  name?: string;
  surname?: string;
};

export async function registerUser(registerForm: RegisterForm) {
  try {
    await axios.put("/user", registerForm);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new Error(`${err.response?.data?.message || err.message}`);
    }
    throw err;
  }

  return true;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  const token = await getToken(request);
  if (typeof userId !== "number" || typeof token !== "string") {
    return null;
  }

  try {
    const user = await axios.get<User>(`/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return user.data;
  } catch {
    throw logout(request);
  }
}
