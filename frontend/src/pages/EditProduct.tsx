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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { AlertProps } from "@mui/material/Alert";
import TextareaAutosize from "@mui/material/TextareaAutosize";

//React And Other
import * as React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ResEditProduct } from "../interfaces/ApiData";
import AlertComponent from "../components/AlertComponent";
import { apiProducts } from "../apis/products";

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

  const { code } = useParams();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = React.useState({
    code: "",
    name: "",
    description: "",
    series: "",
    type: "other",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: apiProducts.getOneProducts.method,
          url: apiProducts.getOneProducts.url + code,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          code: response.data.product.code,
          name: response.data.product.name,
          description: response.data.product.description,
          series: response.data.product.series,
          type: response.data.product.type,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [code]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const name = data.get("name");
      const description = data.get("description");
      const series = data.get("series");
      const type = data.get("type");

      if (!name && !series && !type) {
        setAlertSeverity("error");
        setAlertMessage(["Please fill in required fields."]);
        setOpen(true);
        return;
      }

      const jsonData = {
        name,
        description,
        series,
        type,
      };

      const response = await axios({
        method: apiProducts.editProducts.method,
        url: apiProducts.editProducts.url + code,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: jsonData,
      });

      const responseData: ResEditProduct = response.data;
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

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
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
          <Typography component="h1" variant="h5" mt={8}>
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
                  id="code"
                  name="code"
                  label="Code"
                  required
                  fullWidth
                  autoFocus
                  disabled
                  value={formData.code}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="name"
                  name="name"
                  label="Name"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={handleTextFieldChange}
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
                  value={formData.description}
                  onChange={handleTextareaChange}
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
                  value={formData.series}
                  onChange={handleTextFieldChange}
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
                    onChange={handleSelectChange}
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
