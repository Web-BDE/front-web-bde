import axios from "axios";
import { createCookieSessionStorage, json, redirect } from "remix";
import { buildAxiosHeaders, handleAPIError } from "~/utils/axios";

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

export async function loginUser(loginForm: LoginInfo, redirectTo: string) {
  let session;
  try {
    session = (
      await axios.put<{
        message: string;
        token: string;
        userId: number;
      }>("/session", loginForm)
      ).data;
    } catch (err) {
      handleAPIError(err);
    }
    
    if (!session) {
      throw new Error("Unable to find user");
    }
    
    return createUserSession(session.token, session.userId, redirectTo);
  }
  
  export async function logout(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
  
    try {
      await axios.delete(`/session`, {
        headers: await buildAxiosHeaders(request),
      });
    } catch {}
  
    return redirect("/", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });
  }
  
  async function createUserSession(
    token: string,
    userId: number,
    redirectTo: string
    ) {
      const session = await storage.getSession();
      
  session.set("token", token);
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function requireUserInfo(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId: number = session.get("userId");
  const token: string = session.get("token");

  if (
    !userId ||
    typeof userId !== "number" ||
    !token ||
    typeof token !== "string"
  ) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return { userId, token };
}
