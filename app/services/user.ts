import axios from "axios";
import { UpdateUserFormData, User } from "~/models/User";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";
import FormData from "form-data";

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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function updateSelf(
  token?: string,
  registerInfo?: any,
  recoverToken?: string
) {
  const searchParams = buildSearchParams({
    key: "recoverToken",
    val: recoverToken,
  });
  try {
    const reply = await axios.patch<{ message: string; userId: number }>(
      `/user${searchParams}`,
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function updateUser(
  token: string,
  registerInfo: any,
  userId: number
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
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
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function putAvatar(token: string, userId: number, avatar: Blob) {
  const searchParams = buildSearchParams({
    key: "userId",
    val: userId.toString(),
  });
  try {
    const formData = new FormData();
    formData.append("avatar", Buffer.from(await avatar.arrayBuffer()));

    const multipartHeaders = formData.getHeaders();

    const reply = await axios.put<{
      message: string;
      user: User;
    }>(`/user/avatar${searchParams}`, formData, {
      headers: {
        ...buildAxiosHeaders(token),
        ...multipartHeaders,
      },
      maxBodyLength: 100_000_000,
    });

    return {
      success: reply.data.message,
      code: reply.status,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      if (err.response.data.message.includes("request file too large")) {
        return { error: "Fichier trop volumineux, veuiller envoyer un fichier plus léger" }
      }
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function getAvatar(token: string, userId: number) {
  const searchParams = buildSearchParams({
    key: "userId",
    val: userId.toString(),
  });
  try {
    const reply = await axios.get<{ message: string; avatar: Buffer }>(
      `/user/avatar${searchParams}`,
      { headers: buildAxiosHeaders(token) }
    );

    return {
      success: reply.data.message,
      code: reply.status,
      avatar: reply.data.avatar,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function deleteAvatar(token: string, userId: number) {
  const searchParams = buildSearchParams({
    key: "userId",
    val: userId.toString(),
  });
  try {
    const reply = await axios.delete<{ message: string }>(
      `/user/avatar${searchParams}`,
      { headers: buildAxiosHeaders(token) }
    );

    return {
      success: reply.data.message,
      code: reply.status,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}

export async function getUserCount(
  token: string,
) {
  try {
    const reply = await axios.get<{
      message: string;
      count: number;
    }>("/purchase/count", {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      count: reply.data.count,
    };
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      typeof err.response?.data.message === "string"
    ) {
      return { error: err.response.data.message, code: err.response.status };
    }
    console.error(err);
    return {
      error:
        "Sorry, it seems there is some problem reaching our API. Please contact and administrator.",
    };
  }
}