import axios from "axios";
import { User } from "~/models/User";
import {
  buildAxiosHeaders,
  buildSearchParams,
  handleAPIError,
} from "~/utils/axios";
import { logout, requireAuth } from "./authentication";

type RegisterInfo = {
  email: string;
  password: string;
  pseudo: string;
  name?: string;
  surname?: string;
};

export async function registerUser(registerInfo: RegisterInfo) {
  try {
    const reply = await axios.put<{ message: string }>("/user", registerInfo);

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function updateSelf(token: string, registerInfo: RegisterInfo) {
  try {
    const reply = await axios.patch<{ message: string }>(
      "/user",
      registerInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function updateUser(
  token: string,
  registerInfo: RegisterInfo,
  userId: string
) {
  try {
    const reply = await axios.patch<{ message: string }>(
      `/user/${userId}`,
      registerInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function deleteUser(token: string, userId: number) {
  try {
    const reply = await axios.delete<{ message: string }>(`/user/${userId}`, {
      headers: buildAxiosHeaders(token),
    });

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function getSelft(token: string) {
  try {
    const reply = await axios.get<{ message: string; user: User }>("/user/me", {
      headers: buildAxiosHeaders(token),
    });

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function getUser(token: string, userId: number) {
  try {
    const reply = await axios.get<{ message: string; user: User }>(
      `/user/${userId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}

export async function getManyUser(
  token: string,
  limit?: number,
  offset?: number
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() },
  );
  try {
    const reply = await axios.get<{ message: string; users: User[] }>(
      `/user/${searchParams.entries.length ? "?" + searchParams : ""}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return reply.data;
  } catch (err) {
    handleAPIError(err);
  }
}
