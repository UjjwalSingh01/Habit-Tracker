import React from 'react'
import Navbar from '../components/Navbar'
import Calendar from '../components/Calendar'
import Todo from './Todo'

const Homepage = () => {
  return (
    <div>
        <Navbar />
        
        <Todo />
    </div>
  )
}

export default Homepage