import axios from "axios";
import { User } from "~/models/User";
import { handleAPIError } from "~/utils/axios";
import { logout, requireUserInfo } from "./authentication";

type RegisterInfo = {
  email: string;
  password: string;
  pseudo: string;
  name?: string;
  surname?: string;
};

export async function registerUser(registerInfo: RegisterInfo) {
  try {
    await axios.put("/user", registerInfo);
  } catch (err) {
    handleAPIError(err);
  }

  return "User registered";
}

export async function updateSelf(registerInfo: RegisterInfo) {
  try {
    await axios.patch("/user", registerInfo);
  } catch (err) {
    handleAPIError(err);
  }

  return "User Updated";
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
