import {AppBar,Toolbar, Typography} from "@mui/material"
import React from "react";
export default function Header() {
  const displayDesktop = () => {
    return <Toolbar><Typography variant="h5">Posts And Likes</Typography></Toolbar>;
  };
  
  return (
    <header>
      <AppBar sx={{backgroundColor:'rgb(255 92 142)'}} position="sticky" >{displayDesktop()}</AppBar>
    </header>
  );
}