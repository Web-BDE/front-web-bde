import { ActionFunction, LoaderFunction, redirect } from "remix";
import { logout } from "~/utils/authentication";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export default function Logout() {
  return <div></div>;
}
