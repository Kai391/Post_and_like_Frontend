import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const Footer = () => {
  return (
    <footer>
        <Box 
        sx={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'rgb(255 92 142)',
            height:'8vh',
            bottom:0,
            position:'absolute',
            width:"100%"
            }}>
            <Typography color="white">Copyright by Kai</Typography>
        </Box>
    </footer>
  )
}

export default Footer
