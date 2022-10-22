import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react'
import { Box } from '@mui/system';
import { useEffect,useState } from 'react';

const PostCard = ({ post,usersLike,like,handleLike }) => {
    const [liked,setLiked] = useState(false);

    const handleClickLike = ()=>{
        setLiked(()=>!liked);
        handleLike(!liked,post.id);
    }
    
    useEffect(()=>{
        setLiked(()=>like);
    },[like])
  return (
    <Card sx={{width:{xs:0.9,sm:550,md:700},mb:1,mt:1}}>
      <CardContent>
        <Typography variant='h4'>{post.name}</Typography>
        <Box sx={{display:'flex', alignItems:'center'}}>
          <IconButton onClick={handleClickLike}>
            {liked ?
              <FavoriteIcon color="error" />
              : <FavoriteBorderIcon />}
          </IconButton>
        <Tooltip title={usersLike.toString().replaceAll(', ')} arrow><Typography>{usersLike.toString().replaceAll(', ')}</Typography></Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
