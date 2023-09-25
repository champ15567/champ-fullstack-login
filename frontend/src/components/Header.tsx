// MUI
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// React and other
import React from "react";
import { UserProfile } from "../interfaces/User";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

function Header() {
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const profileJSON = localStorage.getItem("profile") ?? "{}";
  const profile: UserProfile = JSON.parse(profileJSON);
  const location = useLocation();

  const { username } = useParams();
  const isAdmin = profile.role === "admin";

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              {profile.username} ({profile.role ? profile.role : null})
            </Typography>

            {isAdmin &&
            (location.pathname === "/adminhome" ||
              location.pathname === "/createuser" ||
              username) ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{ my: 1, mx: 1.5 }}
                  href="/products"
                >
                  Products
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  href="/adminhome"
                  variant="contained"
                  sx={{ my: 1, mx: 1.5 }}
                  color="primary"
                >
                  Users
                </Button>
              </div>
            )}
          </Toolbar>

          <div>
            <Button
              variant="contained"
              sx={{ my: 1, mx: 1.5 }}
              onClick={handleLogout}
              color="error"
            >
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      ;
    </>
  );
}

export default Header;
