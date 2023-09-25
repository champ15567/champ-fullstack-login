//Mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AlertProps } from "@mui/material/Alert";

//React and Ohter
import * as React from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { UserProfile } from "../interfaces/User";
import { ResData } from "../interfaces/ApiData";
import AlertComponent from "../components/AlertComponent";
import { apiUsers } from "../apis/users";

const defaultTheme = createTheme();

export default function Login() {
  //Alert
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string[]>([]);
  const [alertSeverity, setAlertSeverity] =
    React.useState<AlertProps["severity"]>("success");
  const handleAlertClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = new FormData(event.currentTarget);
      const username = data.get("username");
      const password = data.get("password");

      //Validate Emply
      if (!username || !password) {
        setAlertSeverity("error");
        setAlertMessage(["Please fill in all required fields."]);
        setOpen(true);
        return;
      }

      const jsonData = {
        username,
        password,
      };
      const response = await axios({
        method: apiUsers.login.method,
        url: apiUsers.login.url,
        headers: {
          "Content-Type": "application/json",
        },
        data: jsonData,
      });

      const responseData: ResData = response.data;
      if (responseData.status === "ok") {
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("profile", JSON.stringify(responseData.profile));

        //Alert
        setAlertSeverity("success");
        setAlertMessage([responseData.message]);
        setOpen(true);

        const profileJSON = localStorage.getItem("profile") || "{}";
        const profile: UserProfile = JSON.parse(profileJSON);
        if (profile.role === "admin") {
          setTimeout(() => {
            window.location.href = "/adminhome";
          }, 500);
        } else {
          setTimeout(() => {
            window.location.href = "/home";
          }, 500);
        }
      } else {
        setAlertSeverity("error");
        setAlertMessage([responseData.message]);
        setOpen(true);
      }
    } catch (error: any) {
      setAlertSeverity("error");
      setAlertMessage([error.message]);
      setOpen(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="username"
                  name="username"
                  label="Username"
                  autoComplete="username"
                  required
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 0 }}
            >
              Login
            </Button>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{ mt: 1, mb: 1 }}
              >
                Register
              </Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Container>
      <AlertComponent
        open={open}
        onClose={handleAlertClose}
        severity={alertSeverity}
        messages={alertMessage}
      />
    </ThemeProvider>
  );
}
