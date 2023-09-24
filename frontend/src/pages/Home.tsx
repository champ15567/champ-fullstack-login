//MUI
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

//React and Other
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserProfile } from "../interfaces/User";

const defaultTheme = createTheme();

export default function Home() {
  const profileJSON = localStorage.getItem("profile") || "{}";
  const profile: UserProfile = JSON.parse(profileJSON);

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Header />

      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome!
        </Typography>

        <Typography variant="h5" align="center" color="text.secondary">
          <ul>
            <li>
              <strong>Username:</strong> {profile.username}
            </li>
            <li>
              <strong>Email:</strong> {profile.email}
            </li>
            <li>
              <strong>Role:</strong> {profile.role}
            </li>
          </ul>
        </Typography>
      </Container>

      <Footer />
    </ThemeProvider>
  );
}
