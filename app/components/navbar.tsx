import { Link, LinksFunction, LoaderFunction } from "remix";
import { User } from "~/models/User";

export const loader: LoaderFunction = () => {
  console.log("test");
};

function displayAdminMenu(privilege: number) {
  if (privilege > 0) {
    return (
      <div>
        <Link className="link" to="/challenges/admin">
          Create Challenge
        </Link>
        <Link className="link" to="/shop/admin">
          Create Goodies
        </Link>
      </div>
    );
  }
}

function displayMenu(userInfo?: User) {
  if (userInfo) {
    return (
      <div className="navbar">
        <div className="links">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link" to="/challenges">
            Challenges
          </Link>
          <Link className="link" to="/shop">
            Shop
          </Link>
          {displayAdminMenu(userInfo.privilege)}
        </div>
        <div className="user">
          <h3 className="user-name">{userInfo?.pseudo}</h3>
          <p>
            {typeof userInfo?.wallet === "number"
              ? `Wallet : ${userInfo.wallet}`
              : ""}
          </p>
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="links">
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="/login">
          Login
        </Link>
        <Link className="link" to="/register">
          Register
        </Link>
      </div>
    );
  }
}

export default function NavBar({ userInfo }: { userInfo?: User }) {
  return <div className="navbar">{displayMenu(userInfo)}</div>;
}
