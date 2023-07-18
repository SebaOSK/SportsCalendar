import { Outlet } from "react-router-dom";
import NavBar from "../MainNavigation/NavBar";
<<<<<<< HEAD


function RootLayout(){
  return <>
     <NavBar/>
=======
import { useState } from 'react';
import useToken from '../Auth/UseToken';

function RootLayout(props){
  
  return <>
     <NavBar setLoggedIn={ props.setLoggedIn } loggedIn={ props.loggedIn }/>
>>>>>>> 55c66f4 (moved const router to App(),)
     <Outlet />
        </>;
};

export default RootLayout;