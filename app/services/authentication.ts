import axios from "axios";
import { createCookieSessionStorage, json, redirect } from "remix";
import { buildAxiosHeaders, buildSearchParams } from "~/utils/axios";

type LoginInfo = {
  email: string;
  password: string;
};

const sessionSecret = process.env["SESSION_SECRET"] || "secrettoken";

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function loginUser(loginForm: LoginInfo) {
  try {
    const reply = await axios.put<{
      message: string;
      token: string;
    }>("/session", loginForm);

    const session = await storage.getSession();
    session.set("token", reply.data.token);

    return {
      success: reply.data.message,
      code: reply.status,
      cookie: await storage.commitSession(session),
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

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  try {
    const reply = await axios.delete<{ message: string }>(`/session`, {
      headers: buildAxiosHeaders(token),
    });

    return {
      success: reply.data.message,
      code: reply.status,
      cookie: await storage.destroySession(session),
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

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function requireAuth(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const token: string = session.get("token");

  if (!token || typeof token !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return token;
}

export async function tryGetToken(request: Request) {
  const session = await getUserSession(request);
  const token = session.get("token");

  return token;
}

export async function recoverPassword(email: string) {
  const searchParams = buildSearchParams({ key: "email", val: email });
  try {
    const reply = await axios.post<{ message: string }>(
      `/user/recover${searchParams}`,
      {}
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
