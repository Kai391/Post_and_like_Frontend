import { Pagination } from '@mui/material'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const CustomPagination = ({totalPages=0,changePageApi=()=>null}) => {
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(()=>{
    changePageApi(page);
  },[page,changePageApi])

  return (
    <Pagination count={totalPages} page={page} shape="rounded" color='primary' onChange={handleChange} />
  )
}

export default CustomPagination
