import { ActionFunction, json, LoaderFunction, redirect } from "remix";

import { logout } from "~/services/authentication";

export const action: ActionFunction = async ({ request }) => {
  const { code, ...logoutResult } = await logout(request);

  if (logoutResult.error || !logoutResult.cookie) {
    throw json(
      logoutResult.error || "Cloud not find logout cookies",
      code || 500
    );
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": logoutResult.cookie,
    },
  });
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export default function Logout() {
  return <div></div>;
}
