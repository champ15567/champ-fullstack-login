//MUI
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AlertProps } from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

//React and Other
import * as React from "react";
import Footer from "../components/Footer";
import axios from "axios";
import AlertComponent from "../components/AlertComponent";
import { ResProductsData } from "../interfaces/ApiData";
import { apiProducts } from "../apis/products";
import Header from "../components/Header";

const defaultTheme = createTheme();

export default function CreateProduct() {
  //Alert
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string[]>([]);
  const [alertSeverity, setAlertSeverity] =
    React.useState<AlertProps["severity"]>("success");
  const handleAlertClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = React.useState({
    code: "",
    name: "",
    description: "",
    series: "",
    type: "other",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const code = data.get("code");
      const name = data.get("name");
      const description = data.get("description");
      const series = data.get("series");
      const type = data.get("type");

      //Validate Emply
      if (!code || !name || !type || !series) {
        setAlertSeverity("error");
        setAlertMessage(["Please fill in all required fields."]);
        setOpen(true);
        return;
      }

      const jsonData = {
        code,
        name,
        description,
        series,
        type,
      };
      const token = localStorage.getItem("token");
      const response = await axios({
        method: apiProducts.createProducts.method,
        url: apiProducts.createProducts.url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: jsonData,
      });

      const responseData: ResProductsData = response.data;
      if (responseData.status === "ok") {
        //Alert
        setAlertSeverity("success");
        setAlertMessage([responseData.message]);
        setOpen(true);

        setTimeout(() => {
          window.location.href = "/products";
        }, 500);
      } else {
        setAlertSeverity("error");
        setAlertMessage([responseData.message + "An error occurred."]);
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
  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name as string]: value });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Header />
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
          <Typography component="h1" variant="h5">
            Create Product
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
                  id="code"
                  name="code"
                  label="Code"
                  required
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  id="description"
                  name="description"
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Description"
                  required
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="series"
                  name="series"
                  type="series"
                  label="Series"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    id="type"
                    name="type"
                    labelId="type-label"
                    label="Type"
                    required
                    fullWidth
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <MenuItem value="computer">Computer</MenuItem>
                    <MenuItem value="electrical appliance">
                      Electrical Appliance
                    </MenuItem>
                    <MenuItem value="accessories">Accessories</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/products" variant="body2">
                  Back to home?
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
