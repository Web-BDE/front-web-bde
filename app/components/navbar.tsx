import { Link, LoaderFunction } from "remix";
import { User } from "~/models/User";

export const loader: LoaderFunction = () => {
  console.log("test");
};

function displayAdminMenu(privilege: number) {
  if (privilege > 0) {
    return (
      <div>
        <Link to="/challenges/admin">Challenges Admin</Link>
        <Link to="/shop/admin">Shop Admin</Link>
      </div>
    );
  }
}

function displayMenu(userInfo?: User) {
  if (userInfo) {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/challenges">Challenges</Link>
        <Link to="/shop">Shop</Link>
        {displayAdminMenu(userInfo.privilege)}
        <h2>{userInfo?.pseudo}</h2>
        <p>
          {typeof userInfo?.wallet === "number"
            ? `Wallet : ${userInfo.wallet}`
            : ""}
        </p>
        <form action="/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }
}

export default function NavBar({ userInfo }: { userInfo?: User }) {
  return (
    <div>
      <h1>Nav Bar</h1>
      {displayMenu(userInfo)}
    </div>
  );
}
