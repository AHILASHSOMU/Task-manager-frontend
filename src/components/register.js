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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../ApiCalls/axios";
import { Link } from '@material-ui/core'
import {useNavigate} from "react-router-dom"
import { useSelector } from "react-redux";

const Signup = () => {
  const paperStyle = { padding: "30px 20px", width: 300, margin: "100px auto" };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#1bbd7e" };


  const userLogin = useSelector((state)=> state.user);
  const { userData } = userLogin;

  const Navigate = useNavigate();
  const signUpSchema = Yup.object({
    name: Yup.string().min(3).required("Please enter your Name"),
    email: Yup.string().email().required("Please enter your Email"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Phone Is Required"),
    password: Yup.string().min(6).required("Please enter password"),
    confirmPassword: Yup.string()
      .required()
      .oneOf([Yup.ref("password"), null], "password not matched"),
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [existMessage, setExistMessage] = useState("");

  const initialValues = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,

      onSubmit: async (values, action) => {

        submitHandler();
        
      },
    });

  const submitHandler = async () => {
  try {
    const response = await axios.post(`/user/register`, {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
    });
    console.log(response);
    if (response.data.successMessage) {
      setSuccessMessage(response.data.successMessage);
      setExistMessage('');
      Navigate('/signin');
    }
    if (response.data.existMessage) {
      setExistMessage(response.data.existMessage);
      setSuccessMessage('');
    }
  } catch (error) {
    console.log(error.message);
  }
};

useEffect(() =>{
  if(userData){
    Navigate("/")
  }
},[userData]);

  return (
    <Grid>
      <Paper elevation={20} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign Up</h2>
          <Typography variant="caption" gutterBottom>
            Please fill this form to create an account !
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your name"
          />
          {errors.name && touched.name ? (
            <Typography color="error" variant="body2">
              {errors.name}
            </Typography>
          ) : null}
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
            label="Phone Number"
            name="phoneNumber"
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && touched.phoneNumber ? (
            <Typography color="error" variant="body2">
              {errors.phoneNumber}
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
          />
          {errors.password && touched.password ? (
            <Typography color="error" variant="body2">
              {errors.password}
            </Typography>
          ) : null}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && touched.confirmPassword ? (
            <Typography color="error" variant="body2">
              {errors.confirmPassword}
            </Typography>
          ) : null}
          <FormControlLabel
            control={<Checkbox name="checkedA" />}
            label="I accept the terms and conditions."
          />
          <Typography variant="body1" color="error">
            {existMessage}
          </Typography>
          <Typography variant="body1" color="error">
            {successMessage}
          </Typography>
          <Button type="submit" variant="contained" color="primary">
            Sign up
          </Button>
          <Typography variant="body1">
            Already have an account!{" "}
            <Link href="/signIn" color="primary">
              Sign In
            </Link>
          </Typography>
        </form>
      </Paper>
    </Grid>
  );
};

export default Signup;
