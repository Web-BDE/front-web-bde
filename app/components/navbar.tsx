import { Link, LoaderFunction } from "remix";
import { User } from "~/models/User";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export const loader: LoaderFunction = () => {
  console.log("test");
};

function displayAuthMenu(userInfo?: User) {
  if (!userInfo) {
    return (
      <div>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          className="link"
          to="/login"
        >
          <Button color="inherit" variant="text">
            Login
          </Button>
        </Link>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          className="link"
          to="/register"
        >
          <Button color="inherit" variant="text">
            Register
          </Button>
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {userInfo.name}
        </Typography>
        <form method="post" action="/logout">
          <Button type="submit" color="inherit" variant="text">
            Logout
          </Button>
        </form>
      </div>
    );
  }
}

export default function NavBar({ userInfo }: { userInfo?: User }) {
  let leftLinks: { name: string; link: string }[] = [];

  if (userInfo) {
    leftLinks.push(
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Challenges",
        link: "/challenges",
      },
      {
        name: "Shop",
        link: "/shop",
      }
    );

    if (userInfo?.privilege && userInfo?.privilege > 0) {
      leftLinks.push(
        { name: "Challenge Admin", link: "/challenges/admin" },
        { name: "Shop Admin", link: "/shop/admin" }
      );
    }
  } else {
    leftLinks.push({
      name: "Home",
      link: "/",
    });
  }

  return (
    <div className="navbar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>
              {leftLinks.map((link) => {
                return (
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    className="link"
                    to={link.link}
                  >
                    <Button color="inherit" variant="text">
                      {link.name}
                    </Button>
                  </Link>
                );
              })}
            </Typography>
            {displayAuthMenu(userInfo)}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
