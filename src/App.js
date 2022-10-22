import { Box, TextField } from '@mui/material'
import React from 'react'
import Header from './components/Header'
import PostCard from './components/PostCard'
import CustomPagination from './components/CustomPagination'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { serverReq } from './helper'

const BASE_URL = 'http://localhost:3001'

const App = ({ myname }) => {
  const [iam] = useState(myname);
  const [searchMsg,setSearchMsg] = useState(null);
  const maxLikeId = useRef(0);
  const [posts, setPosts] = useState(() => []);
  const [likes, setLikes] = useState(() => []);
  const [totalPages, setTotalPages] = useState(0);
  const [liked, setLiked] = useState(() => [])
  const [pageno, setPageno] = useState(1);

  const handleChangePage = (page) => {
    setPageno(page);
  }

  const handleClickLike = async (id, checked) => {
    let res = undefined;
    if (checked)
      res = await serverReq('POST', BASE_URL + `/posts/${id}/${iam}/like`);
    else
      res = await serverReq('DELETE', BASE_URL + `/posts/${id}/${iam}/like`);
  }

  const autoSearch = async (e) => {
    let res = await serverReq('GET', BASE_URL + '/search/post/autocomplete', null, { value: e.target.value.trim() })
    if (res.success) {
      setSearchMsg(null);
      let POSTDATA = [...res.data.posts];
      let LIKESDATA = [...res.data.likes];
      setTotalPages(() => Math.round(POSTDATA.length / 2))
      setPosts((data) => [
        ...POSTDATA
      ])

      setLikes(() => [...LIKESDATA])
      POSTDATA.forEach(obj => {
        if (!LIKESDATA.filter(item => item.post_id === obj.id).length) {

          setLikes((data) => [
            ...data,
            { id: maxLikeId.current++, post_id: obj.id, users: [] }
          ])
        }
      })
      LIKESDATA.forEach(obj => {
        if (maxLikeId.current < obj.id) maxLikeId.current = obj.id
        if (obj.users.indexOf(iam) !== -1) {
          setLiked((data) => [
            ...data,
            obj.post_id
          ])
        }
      })
    }
    else setSearchMsg(res.data);
  }

  useEffect(() => {
    async function fetchData() {
      let res = await serverReq('GET', BASE_URL + '/posts');
      let POSTDATA = [...res.data.posts];
      let LIKESDATA = [...res.data.likes];
      setTotalPages(() => Math.round(POSTDATA.length / 2))
      setPosts((data) => [
        ...POSTDATA
      ])

      setLikes(() => [...LIKESDATA])
      POSTDATA.forEach(obj => {
        if (!LIKESDATA.filter(item => item.post_id === obj.id).length) {

          setLikes((data) => [
            ...data,
            { id: maxLikeId.current++, post_id: obj.id, users: [] }
          ])
        }
      })
      LIKESDATA.forEach(obj => {
        if (maxLikeId.current < obj.id) maxLikeId.current = obj.id
        if (obj.users.indexOf(iam) !== -1) {
          setLiked((data) => [
            ...data,
            obj.post_id
          ])
        }
      })
    }
    if (!posts.length) fetchData();
  }, [])

  useEffect(() => {
    posts.forEach(obj => {
      if (liked.indexOf(obj.id) !== -1) {
        setLikes(likes.map(likeObj => {
          if (likeObj.post_id === obj.id) {
            if (likeObj.users.indexOf(iam) === -1)
              likeObj.users = [...likeObj.users, iam]
          };
          return likeObj;
        }))
      }
      else {
        setLikes(likes.map(likeObj => {
          if (likeObj.post_id === obj.id) {
            likeObj.users = likeObj.users.filter(name => name !== iam)
          };
          return likeObj;
        }))
      }
    })
  }, [liked])

  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        flexDirection: 'column'
      }}>
        <TextField variant='standard' label="Search post here..." onChange={autoSearch} />
        {!searchMsg?posts.slice(pageno * 2 - 2, pageno * 2)
          .map(obj => (
            <PostCard
              key={obj.id}
              id={obj.id}
              likes={liked.indexOf(obj.id) !== -1 ? true : false}
              handleLike={setLiked}
              clickLike={handleClickLike}
              name={obj.name}
              likedUser={
                likes.filter(item => item.post_id === obj.id).length ?
                  likes.filter(item => item.post_id === obj.id)[0].users
                  : []
              } />
          )):searchMsg}
        <Box mt={1}>
          <CustomPagination totalPages={totalPages} changePageApi={handleChangePage} />
        </Box>
      </Box>
    </>
  )
}

export default App
