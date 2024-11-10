import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import image from '../assets/image2.jpeg'

export default function Register(){

    const navigate = useNavigate();

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleChange(){
        console.log(firstname)
        console.log(lastname)
        console.log(email)
        console.log(password)

        try {
            const response = await axios.post('https://habit-tracker-backend.dragneeln949.workers.dev/register', {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            })

            localStorage.setItem("token", response.data.message)

            navigate('/homepage');

        } catch (error) {
            console.error("Error in Register: ", error)
        }
    }

  return (
    <div className='flex bg-red-300 h-screen justify-center items-center'>
        <div className=' w-1/4 h-3/4'>
            <img className='h-full w-full' src={image} alt="" />
        </div>
        <div className='flex flex-col bg-rose-600 w-1/4 h-3/4 gap-7 justify-center items-center'>
            <h1 className='mt-5 mb-3 font-bold font-serif text-3xl'>Register</h1>
            <div className='flex flex-col justify-center gap-7 items-center w-4/5'>
                <div className='flex justify-around gap-2'>
                    <input className='border-2 w-3/4 h-10 px-10 rounded-2xl text-lg' type="text" onChange={(e) => {setFirstName(e.target.value)}} placeholder='First name'/>
                    <input className='border-2 w-3/4 h-10 px-10 rounded-2xl text-lg' type="text" onChange={(e) => {setLastName(e.target.value)}} placeholder='Last name'/>
                </div>
                <input className='border-2 w-3/4 h-10 px-10 rounded-2xl text-lg' type="text" onChange={(e) => {setEmail(e.target.value)}} placeholder='Email'/>
                <input className='border-2 w-3/4 h-10 px-10 rounded-2xl text-lg' type="text" onChange={(e) => {setPassword(e.target.value)}} placeholder='Password'/>
            </div>
            <button className='bg-blue-500 hover:bg-blue-400 w-24 h-10 my-3 p-1 text-lg rounded-3xl' onClick={() => {handleChange()}} >Register</button>
            <p className='text-slate-500'>Account Already Exist ? <span className='text-white'><Link to='/'> Login </Link></span> </p>
        </div>
    </div>
  )
}
