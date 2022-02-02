import axios from "axios";
import { User } from "~/models/User";
import { handleAPIError } from "~/utils/axios";
import { logout, requireUserInfo } from "./authentication";

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
    handleAPIError(err);
  }

  return "User registered";
}

export async function getSelft(request: Request) {
  const userInfo = await requireUserInfo(request, "/");

  let user;
  try {
    user = (
      await axios.get<{ message: string; user: User }>(
        `/user/${userInfo.userId}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      )
    ).data.user;
  } catch {
    throw logout(request);
  }
  return user;
}
