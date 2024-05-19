import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
  
    async function handleChange(){
        try {
            // as a param ??
            const response = await axios.get('http://localhost:8787/login', {
                headers: {
                    email: email,
                    password: password
                }
            });

            localStorage.setItem("token", response.data.message)

            navigate('/homepage');

        } catch (error) {
            console.error("Error in Login: ", error);
        }
    }

  return (
    <div className='flex flex-col justify-center items-center mt-16'>
        <input className='border-2 w-1/3 my-2 rounded-xl' onChange={(e) => {setEmail(e.target.value)}} type="text" placeholder='email' />
        <input className='border-2 w-1/3 my-2 rounded-xl' onChange={(e) => {setPassword(e.target.value)}} type="text" placeholder='password' />
        <button className='bg-blue-500 hover:bg-blue-400 w-20 my-3 p-1 rounded-2xl' onClick={() => {handleChange()}}> Login </button>
        <button className='bg-blue-500 hover:bg-blue-400 w-24 my-3 p-1 rounded-2xl' ><Link to='/register'> Register </Link>  </button>
    </div>
  )
}

{/* <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm bg-opacity-30 relative'>
            <h1 className='text-4xl text-whitefont-bold text-center mb-6'>Login</h1>
            <div>
                <div className='relative my-4'>
                    <input type="text" onChange={(e) => {setEmail(e.target.value)}} className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-0 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                    <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:translate-y-6'>Your Email</label>
                </div>
                <div className='relative my-4'>
                    <input type="text" onChange={(e) => {setPassword(e.target.value)}} className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-0 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                    <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:translate-y-6'>Your Password</label>
                </div>
                <div className='flex justify-center items-center'>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='' id='' />
                        <label htmlFor="Rember Me">Remember Me</label>
                    </div>
                    <span className='text-blue-500'>Forgot Password?</span>
                </div>
                <button onClick={() => {handleChange()}} className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300' type='submit'>Login</button>
                <div>
                    <span className='m-4'>new Here? <Link className='text-blue-500' to='/register'>Create an Account</Link> </span>
                </div>
            </div>
        </div> */}