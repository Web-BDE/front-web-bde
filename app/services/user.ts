import axios from "axios";
import { User } from "~/models/User";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";

type RegisterInfo = {
  email: string;
  password: string;
  pseudo: string;
  name?: string;
  surname?: string;
};

export async function registerUser(registerInfo: RegisterInfo) {
  try {
    const reply = await axios.put<{ message: string; userId: number }>(
      "/user",
      registerInfo
    );

    return {
      success: reply.data.message,
      code: reply.status,
      userId: reply.data.userId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function updateSelf(token: string, registerInfo: RegisterInfo) {
  try {
    const reply = await axios.patch<{ message: string; userId: number }>(
      "/user",
      registerInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      userId: reply.data.userId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function updateUser(
  token: string,
  registerInfo: RegisterInfo,
  userId: string
) {
  try {
    const reply = await axios.patch<{ message: string; userId: number }>(
      `/user/${userId}`,
      registerInfo,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      userId: reply.data.userId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function deleteUser(token: string, userId: number) {
  try {
    const reply = await axios.delete<{ message: string; userId: number }>(
      `/user/${userId}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      userId: reply.data.userId,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function getSelft(token: string) {
  try {
    const reply = await axios.get<{ message: string; user: User }>("/user/me", {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      user: reply.data.user,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
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

    return {
      success: reply.data.message,
      code: reply.status,
      user: reply.data.user,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}

export async function getManyUser(
  token: string,
  limit?: number,
  offset?: number
) {
  const searchParams = buildSearchParams(
    { key: "limit", val: limit?.toString() },
    { key: "offset", val: offset?.toString() }
  );
  try {
    const reply = await axios.get<{ message: string; users: User[] }>(
      `/user${searchParams}`,
      {
        headers: buildAxiosHeaders(token),
      }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      users: reply.data.users,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    throw err;
  }
}
