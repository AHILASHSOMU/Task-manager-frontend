import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from '@material-ui/core'
import axios from "../ApiCalls/axios";
import {useDispatch, useSelector} from 'react-redux'
import { setUserLogin } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const paperStyle = { padding: "30px 20px", width: 300, margin: "150px auto" };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#1bbd7e" };

  const signInSchema = Yup.object({
    email: Yup.string().email().required("Please enter your Email"),
    password: Yup.string().min(6).required("Please enter password"),
  });


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [notFoundMessage,setNotFoundMessage] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };


  const userLogin = useSelector((state)=> state.user);
  const { userData } = userLogin;

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signInSchema,

      onSubmit: async (values, action) => {
        submitHandler();
      },
    });

  const submitHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(`/user/signIn`, {
        email: values.email,
        password: values.password,
      },config);
      console.log(response);
      if(response.data.token){
         dispatch(
          setUserLogin({
            token: response.data.token,
            userData: response.data.userData
          })
         )
      }if(response.data.message){
        setNotFoundMessage(response.data.message)
      }
      
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() =>{
    if(userData){
      navigate("/")
    }
  },[userData]);

  return (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign In</h2>
          <Typography variant="caption" gutterBottom>
            Please fill this form to create an account !
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
          />
          {errors.email && touched.email ? (
            <Typography color="error" variant="body2">
              {errors.email}
            </Typography>
          ) : null}

          <TextField
            fullWidth
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            style={{ marginBottom: '16px' }}
          />
          {errors.password && touched.password ? (
            <Typography color="error" variant="body2">
              {errors.password}
            </Typography>
          ) : null}

          <Typography variant="body1" color="error">
            {notFoundMessage}
          </Typography>
          <Typography variant="body1" color="error">
            {successMessage}
          </Typography>
          <Button type="submit" variant="contained" color="primary">
            Sign In
          </Button>
          <Typography variant="body1">
            Create an account!{" "}
            <Link href="/signup" color="primary">
              Sign up
            </Link>
          </Typography>
        </form>
      </Paper>
    </Grid>
  );
};

export default SignIn;
