//MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { AlertProps } from "@mui/material/Alert";

//React And Other
import * as React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ResEditUser } from "../interfaces/ApiData";
import AlertComponent from "../components/AlertComponent";
import { apiUsers } from "../apis/users";

const defaultTheme = createTheme();

export default function Edit() {
  //Alert
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string[]>([]);
  const [alertSeverity, setAlertSeverity] =
    React.useState<AlertProps["severity"]>("success");
  const handleAlertClose = () => {
    setOpen(false);
  };

  const { username } = useParams();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: apiUsers.getOneUsers.method,
          url: apiUsers.getOneUsers.url + username,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, [username]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
      const role = data.get("role");

      if (!email && !password && !role) {
        setAlertSeverity("error");
        setAlertMessage(["Please fill in required fields."]);
        setOpen(true);
        return;
      }

      const jsonData = {
        password,
        email,
        role,
      };
      const response = await axios({
        method: apiUsers.editUsers.method,
        url: apiUsers.editUsers.url + username,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: jsonData,
      });

      const responseData: ResEditUser = response.data;
      if (responseData.status === "ok") {
        //Alert
        setAlertSeverity("success");
        setAlertMessage([responseData.message]);
        setOpen(true);

        setTimeout(() => {
          window.location.href = "/adminhome";
        }, 500);
      } else {
        setAlertSeverity("error");
        setAlertMessage([responseData.message]);
        setOpen(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setAlertSeverity("error");
        setAlertMessage(error.response.data.message);
        setOpen(true);
      } else {
        setAlertSeverity("error");
        setAlertMessage([error.message]);
        setOpen(true);
      }
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Header />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit
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
                  disabled
                  required
                  fullWidth
                  autoFocus
                  value={formData.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    id="role"
                    name="role"
                    labelId="role-label"
                    label="Role"
                    required
                    fullWidth
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  required
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Edit
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/adminhome" variant="body2">
                  Go Back To Admin Home
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Footer />
      <AlertComponent
        open={open}
        onClose={handleAlertClose}
        severity={alertSeverity}
        messages={alertMessage}
      />
    </ThemeProvider>
  );
}
