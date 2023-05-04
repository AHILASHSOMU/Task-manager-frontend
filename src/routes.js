import React from "react";
import {Route, Routes, Outlet, Navigate} from "react-router-dom"
import Register from "./components/register"
import SignIn from "./components/signIn";
import Home from "./pages/Home";
import { useSelector } from "react-redux";


function UserProtected() {
  const userToken = useSelector((state) => state.user.token);
  return userToken ? <Outlet/> : <Navigate to ='/signin'/>;
}

function routes() {
  return (
   <Routes>
    <Route path="/signup" element={<Register/>}/>
    <Route path="/signin"  element={<SignIn/>}/>
    <Route element ={<UserProtected/>}>
    <Route path="/" element={<Home/>}/>
    </Route>
    
   </Routes>
  )
}

export default routes
