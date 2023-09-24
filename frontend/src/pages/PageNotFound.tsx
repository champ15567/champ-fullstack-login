import { Box, Button, Typography } from "@mui/material";
import { UserProfile } from "../interfaces/User";
type Props = {};

function PageNotFound({}: Props) {
  const handleBackHomeClick = () => {
    const profileJSON = localStorage.getItem("profile") || "{}";
    const profile: UserProfile = JSON.parse(profileJSON);

    if (profile.role === "admin") {
      window.location.href = "/adminhome";
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6" mb={3}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" onClick={handleBackHomeClick}>
        Back Home
      </Button>
    </Box>
  );
}

export default PageNotFound;
