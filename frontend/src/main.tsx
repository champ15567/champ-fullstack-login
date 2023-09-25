//React
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

//Other
import axios from "axios";
import { UserProfile } from "./interfaces/User.ts";
import { apiAuth } from "./apis/auth.ts";

//Page
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import Edit from "./pages/EditUsers.tsx";
import CreateUser from "./pages/CreateUser.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";

interface DataResponse {
  status: string;
  decoded: {
    username: string;
    iat: string;
    exp: string;
  };
}

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      try {
        const response = await axios({
          method: apiAuth.method,
          url: apiAuth.url,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data: DataResponse = response.data;

        if (data.status === "ok") {
        } else {
          alert("Authentication failed");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while validating the token");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    if (token) {
      validateToken();
    }
  }, []);

  const token = localStorage.getItem("token");
  const profileJSON = localStorage.getItem("profile") || "{}";
  const profile: UserProfile = JSON.parse(profileJSON);
  const isAdmin = profile.role === "admin";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              isAdmin ? (
                <Navigate to="/adminhome" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            token ? (
              isAdmin ? (
                <Navigate to="/adminhome" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            token ? (
              isAdmin ? (
                <Navigate to="/adminhome" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/home"
          element={
            token ? (
              isAdmin ? (
                <Navigate to="/adminhome" />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/adminhome"
          element={
            token ? (
              isAdmin ? (
                <AdminHome />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/editusers/:username"
          element={
            token ? isAdmin ? <Edit /> : <Home /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/createuser"
          element={
            token ? (
              isAdmin ? (
                <CreateUser />
              ) : (
                <Home />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="*"
          element={token ? <PageNotFound /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
