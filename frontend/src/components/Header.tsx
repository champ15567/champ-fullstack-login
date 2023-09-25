// MUI
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// React and other
import React from "react";
import { UserProfile } from "../interfaces/User";
import { Link } from "react-router-dom";

function Header() {
  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const profileJSON = localStorage.getItem("profile") ?? "{}";
  const profile: UserProfile = JSON.parse(profileJSON);

  const isAdmin = profile.role === "admin";

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {profile.username} ({profile.role ? profile.role : null})
          </Typography>
          {isAdmin && (
            <>
              <Link to="/editusers" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{ my: 1, mx: 1.5 }}
                  color="primary"
                >
                  Users
                </Button>
              </Link>

              <Link to="/editproducts" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{ my: 1, mx: 1.5 }}
                  color="primary"
                >
                  Products
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="contained"
            sx={{ my: 1, mx: 1.5 }}
            onClick={handleLogout}
            color="error"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      ;
    </>
  );
}

export default Header;
