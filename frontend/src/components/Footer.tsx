//MUI
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <Container
      maxWidth="md"
      component="footer"
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        mt: 8,
        py: [3, 4],
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {new Date().getFullYear()} Champ Siradanai Full Stack Developer
      </Typography>
    </Container>
  );
}

export default Footer;
