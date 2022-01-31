import axios from "axios"
import { createCookieSessionStorage, redirect } from "remix";

type LoginForm = {
    email: string;
    password: string
}

type UserInfo = {
    id: number;
    pseudo: string;
    wallet: string;
    privilege: 0 | 1 | 2
} | undefined

export let userInfo: UserInfo;

export async function loginUser(loginForm: LoginForm) {
    const session = await axios.put<{message: string, token: string, userInfo: UserInfo}>("session", loginForm);

    if(!session) {
        return null;
    }

    userInfo = userInfo;

    return session.data.token
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

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
    httpOnly: true
  }
});

export async function createUserSession(
    token: string,
    redirectTo: string
  ) {
    const session = await storage.getSession();
    session.set("token", token);
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await storage.commitSession(session)
      }
    });
  }