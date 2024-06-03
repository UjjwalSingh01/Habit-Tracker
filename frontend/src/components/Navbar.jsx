import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){

  const navigate = useNavigate()

  async function logout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className='flex  bg-red-400 justify-between'>
      <div className='flex gap-4 h-16 justify-center items-center'>
          <h1 className='text-2xl font-medium font-serif hover:font-semibold'><Link className='m-3' to='/homepage'> Todo </Link></h1>
          <h1 className='text-2xl font-medium font-serif hover:font-semibold'><Link className='m-3' to='/tracker'> Tracker </Link></h1>
      </div>
      <div className='flex gap-4 h-16 justify-center items-center mr-5'>
        <button onClick={() => {logout()}} className='bg-blue-300 p-2 rounded-2xl text-md font-medium font-serif hover:bg-blue-400'>Logout</button>
      </div>
    </div>
  )
}

