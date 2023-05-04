import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import banner from "../public/banner3.jpg";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { setUserLogout } from "../store/userSlice";

function HomePage() {


  const dispatch = useDispatch();

const handleLogout = () =>{
  dispatch(setUserLogout());
}

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: "300px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          p: 2,
          color: "#fff",
        }}
      >
        <Typography variant="h1" component="h1">
          Task Manager
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 2,
          p: 2,
        }}
      >
        <Button onClick={handleLogout} variant="contained" color="secondary">
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default HomePage;
