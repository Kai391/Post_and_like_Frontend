import { Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React from 'react'
import { Box } from '@mui/system';
import { useEffect } from 'react';

const PostCard = ({ likes = false, name='',likedUser=[],handleLike=()=>null,id=0,clickLike, }) => {
  const [liked, setLiked] = React.useState(() => likes);
  const handleLiked = () => {
    setLiked(() => !liked);
    clickLike(id,!liked);
  }
  useEffect(()=>{
    if(liked) handleLike((data)=>[...data,id]);
    else handleLike((data)=>[...data.filter(i=>i!==id)])
  },[liked])
  return (
    <Card>
      <CardContent>
        <Typography variant='h4'>{name}</Typography>
        <Box sx={{display:'flex', alignItems:'center'}}>
          <IconButton onClick={handleLiked}>
            {liked ?
              <FavoriteIcon color="error" />
              : <FavoriteBorderIcon />}
          </IconButton>
        <Tooltip title={likedUser.toString().replaceAll(', ')} arrow><Typography>{likedUser.toString().replaceAll(', ')}</Typography></Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PostCard
