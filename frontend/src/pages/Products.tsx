//MUI
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import DialogContentText from "@mui/material/DialogContentText";
import { AlertProps } from "@mui/material/Alert";
import Toolbar from "@mui/material/Toolbar";

//React and Other
import * as React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import AlertComponent from "../components/AlertComponent";
import { apiProducts } from "../apis/products";

//Table
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
}

interface TableData {
  code: string;
  name: string;
  series: string;
  description: string;
  type: "computer" | "electrical appliance" | "accessories" | "other";
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// End Table
const defaultTheme = createTheme();

export default function Products() {
  //Alert
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState<string[]>([]);
  const [alertSeverity, setAlertSeverity] =
    React.useState<AlertProps["severity"]>("success");
  const handleAlertClose = () => {
    setOpen(false);
  };

  //PopUp
  const [codeToDelete, setCodeToDelete] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleOpenDeleteDialog = (codeToDelete: string) => {
    setCodeToDelete(codeToDelete);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  //Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<TableData[]>([]);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log(event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //End pagination

  const token = localStorage.getItem("token");

  //Get Data for table
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: apiProducts.getAllProducts.method,
          url: apiProducts.getAllProducts.url,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setRows(
          response.data.products.sort((a: any, b: any) =>
            a.calories < b.calories ? -1 : 1
          )
        );
      } catch (error: any) {
        setAlertSeverity("error");
        setAlertMessage([error.message]);
        setOpen(true);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    setOpenDeleteDialog(false);

    try {
      await axios({
        method: apiProducts.deleteProducts.method,
        url: apiProducts.deleteProducts.url + codeToDelete,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setAlertSeverity("success");
      setAlertMessage(["Product deleted successfully"]);
      setOpen(true);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      setAlertSeverity("error");
      setAlertMessage([error.message]);
      setOpen(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Header />

      <Container
        disableGutters
        maxWidth="md"
        component="main"
        sx={{ pt: 4, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome Admin!
        </Typography>
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Products
          </Typography>
          <Button
            variant="contained"
            sx={{ my: 1, mx: 1.5 }}
            color="primary"
            href="/createproduct"
          >
            Create Product
          </Button>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: 160 }} align="left">
                  Code
                </StyledTableCell>
                <StyledTableCell style={{ width: 160 }} align="left">
                  Name
                </StyledTableCell>
                <StyledTableCell style={{ width: 160 }} align="left">
                  Description
                </StyledTableCell>
                <StyledTableCell style={{ width: 160 }} align="left">
                  Series
                </StyledTableCell>
                <StyledTableCell style={{ width: 160 }} align="left">
                  Type
                </StyledTableCell>
                <StyledTableCell style={{ width: 160 }} align="center">
                  Action
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
                <StyledTableRow key={row.code}>
                  <StyledTableCell style={{ width: 50 }} align="left">
                    {row.code}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 50 }} align="left">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 200 }} align="left">
                    {row.description}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 160 }} align="left">
                    {row.series}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 160 }} align="left">
                    {row.type}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton
                      style={{ color: "black" }}
                      component={Link}
                      href={`/editproducts/${row.code}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(row.code)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the product with code:{" "}
              {codeToDelete}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <AlertComponent
        open={open}
        onClose={handleAlertClose}
        severity={alertSeverity}
        messages={alertMessage}
      />
      <Footer />
    </ThemeProvider>
  );
}
