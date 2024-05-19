import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <div className='flex bg-red-500 gap-4 h-10 items-center'>
        <Link className='m-3' to='/homepage'> Todo </Link>
        <Link className='m-3' to='/tracker'> Tracker </Link>
    </div>
  )
}

