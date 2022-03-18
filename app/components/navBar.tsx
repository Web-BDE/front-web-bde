import { Form, Link, useOutletContext, useTransition } from "remix";
import { User } from "~/models/User";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Grid, Tooltip } from "@mui/material";
import React from "react";
import { ContextData } from "~/root";

function displayAuthMenu(
  handleCloseUserMenu: () => void,
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void,
  anchorElUser: HTMLElement | null,
  userInfo?: User,
  API_URL?: string
) {
  if (!userInfo) {
    return (
      <div>
        <Link style={{ textDecoration: "none", color: "white" }} to="/login">
          <Button color="inherit" variant="text">
            Login
          </Button>
        </Link>
        <Link style={{ textDecoration: "none", color: "white" }} to="/register">
          <Button color="inherit" variant="text">
            Register
          </Button>
        </Link>
      </div>
    );
  } else {
    const transition = useTransition();

    return (
      <div>
        <Grid container>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{ marginRight: "50px", marginTop: "2px" }}
          >
            Wallet : <b>{userInfo.wallet}</b>
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="User Settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  src={`${API_URL || "http://localhost:4000/"}user/avatar/${
                    userInfo.avatarId
                  }`}
                  alt={userInfo.pseudo}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="1">
                <Typography>{userInfo.pseudo}</Typography>
              </MenuItem>
              <MenuItem key="2" onClick={handleCloseUserMenu}>
                <Link
                  to={`/users/${userInfo.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button color="inherit" variant="text">
                    Profile
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem key="3" onClick={handleCloseUserMenu}>
                <Form method="post" action="/logout">
                  <Button
                    disabled={transition.state === "submitting"}
                    type="submit"
                    color="inherit"
                    variant="text"
                  >
                    Logout
                  </Button>
                </Form>
              </MenuItem>
            </Menu>
          </Box>
        </Grid>
      </div>
    );
  }
}

export default function NavBar({
  userInfo,
  API_URL,
}: {
  userInfo?: User;
  API_URL?: string;
}) {
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
        link: "/goodies",
      },
      {
        name: "Users",
        link: "/users",
      }
    );

    if (userInfo?.privilege && userInfo?.privilege > 0) {
      leftLinks.push(
        { name: "Challenge Admin", link: "/challenges/admin" },
        { name: "Shop Admin", link: "/goodies/admin" }
      );
    }
  } else {
    leftLinks.push({
      name: "Home",
      link: "/",
    });
  }

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: { md: "flex", lg: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { md: "flex", lg: "none" },
              }}
            >
              {leftLinks.map((link, index) => (
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={link.link}
                  key={index}
                >
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{link.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "none", lg: "block" },
            }}
          >
            {leftLinks.map((link, index) => {
              return (
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to={link.link}
                  key={index}
                >
                  <Button color="inherit" variant="text">
                    {link.name}
                  </Button>
                </Link>
              );
            })}
          </Typography>
          {displayAuthMenu(
            handleCloseUserMenu,
            handleOpenUserMenu,
            anchorElUser,
            userInfo,
            API_URL
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
