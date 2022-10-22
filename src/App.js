import { Box, TextField } from '@mui/material'
import React from 'react'
import Header from './components/Header'
import Posts from './components/Posts'
import CustomPagination from './components/CustomPagination'
import { useState } from 'react'
import { useEffect } from 'react'
import { serverReq } from './helper'
import Footer from './components/Footer'
import { useReducer } from 'react'

const BASE_URL = 'http://localhost:3001'

const INIT_STATE = { posts: [], likes: [] }

const LABELS = {
  FETCH_POSTS_LIKES: "FETCH_POSTS_LIKES",
  ADD_LIKE_USER: "ADD_LIKE_USER",
  REMOVE_LIKE_USER: "REMOVE_LIKE_USER",
}

const reducer = (state, action) => {
  switch (action.type) {
    case LABELS.FETCH_POSTS_LIKES:
      return { posts: [...action.payload.posts], likes: [...action.payload.likes] }
    case LABELS.ADD_LIKE_USER:
      let usersArr = state.likes.filter(obj => obj.post_id === action.payload.id);
      if (!usersArr.length) {
        let likes = [...state.likes,
        {
          id: state.likes[state.likes.length - 1].id,
          post_id: action.payload.id,
          users: [action.payload.name]
        }]
        return { ...state, likes }
      }
      let users = usersArr[0].users;
      if (users.indexOf(action.payload.name) === -1) {
        users = [...users, action.payload.name];
      }
      state = {
        ...state, likes: state.likes.map(obj => {
          if (obj.post_id === action.payload.id)
            obj.users = [...users];
          return obj;
        })
      }
      return { ...state };
    case LABELS.REMOVE_LIKE_USER:
      return {
        ...state, likes: [...state.likes.map(obj => {
          if (obj.post_id === action.payload.id) {
            obj.users = obj.users.filter(user => user !== action.payload.name)
          }
          return obj;
        })]
      }
    default:
      return state;
  }
}

const responser = (type, payload) => {
  return { type, payload };
}

const App = ({ myname }) => {

  const [AllPosts, dispatch] = useReducer(reducer, INIT_STATE)

  const [iam] = useState(myname);
  const [searchMsg, setSearchMsg] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageno, setPageno] = useState(1);
  const [myLikedPostIdsArr, setMyLikedPostIdsArr] = useState(() => []);

  const handleChangePage = (page) => {
    setPageno(page);
  }

  const autoSearch = async(e)=>{
    let res = await serverReq('GET',BASE_URL+'/search/post/autocomplete',null,{value:e.target.value.trim()});
    if(res.success){
      setSearchMsg(null);
      dispatch(responser(LABELS.FETCH_POSTS_LIKES,res.data));
    }else{
      setSearchMsg(res.data);
    }
  }

  const handleClickLike = async (checked, id) => {
    let res = undefined;
    if (checked) {
      res = await serverReq('POST', BASE_URL + `/posts/${id}/${iam}/like`);
      if(res.success){
        setMyLikedPostIdsArr((data) => [...data, id]);
        dispatch(responser(LABELS.ADD_LIKE_USER, { id, name: iam }));
      }
    }
    else {
      res = await serverReq('DELETE', BASE_URL + `/posts/${id}/${iam}/like`);
      if(res.success){
        setMyLikedPostIdsArr(data => data.filter(i => i !== id));
        dispatch(responser(LABELS.REMOVE_LIKE_USER, { id, name: iam }));
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      let res = await serverReq('GET', BASE_URL + '/posts');
      if (res.success) {
        dispatch(responser(LABELS.FETCH_POSTS_LIKES, res.data));
      }
    }
    if (!AllPosts.posts.length) fetchData();
  }, [])

  useEffect(() => {
    if (AllPosts.posts.length) {
      setTotalPages(() => Math.round(AllPosts.posts.length / 2))

      //making my likes post's id arr 
      AllPosts.likes.forEach(obj => {
        if (obj.users.indexOf(iam) !== -1) {
          if (myLikedPostIdsArr.indexOf(obj.post_id) === -1)
            setMyLikedPostIdsArr((data) => [...data, obj.post_id]);
        }
      })
    }
  }, [AllPosts.posts.length])

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
        <TextField variant='standard' label="Search post here..." sx={{ width: { xs: 0.9, sm: 550, md: 700 } }} onChange={autoSearch} color="primary" />
        {!searchMsg ? AllPosts.posts.slice(pageno * 2 - 2, pageno * 2)
          .map((obj, index) => (
            <Posts
              key={index}
              like={myLikedPostIdsArr.indexOf(obj.id) !== -1 ? true : false}
              post={obj}
              usersLike={
                AllPosts.likes.filter(item => item.post_id === obj.id).length ?
                  AllPosts.likes.filter(item => item.post_id === obj.id)[0].users
                  : []
              }
              handleLike={handleClickLike}
            />
          )) : searchMsg}
        <Box mt={1}>
          <CustomPagination totalPages={totalPages} changePageApi={handleChangePage} />
        </Box>
      </Box>
      <Footer />
    </>
  )
}

export default App
