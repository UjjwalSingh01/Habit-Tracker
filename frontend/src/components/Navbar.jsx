import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <div className='flex bg-red-400 gap-4 h-16 justify-center items-center'>
        <h1 className='text-2xl font-medium font-serif hover:font-semibold'><Link className='m-3' to='/homepage'> Todo </Link></h1>
        <h1 className='text-2xl font-medium font-serif hover:font-semibold'><Link className='m-3' to='/tracker'> Tracker </Link></h1>
    </div>
  )
}

