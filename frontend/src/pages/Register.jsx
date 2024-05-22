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
        try {
            const response = await axios.post('http://localhost:8787/register', {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            })

            localStorage.setItem("token", response.data.message)

            navigate('/homepage');

        } catch (error) {
            console.error("Error in REgister: ", error)
        }
    }

  return (
    <div className='flex bg-purple-800 h-screen justify-center items-center'>
        <div className='bg-red-500 w-1/4 h-3/4'>
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
            <p className='text-slate-500'>Account Already Exist ? <span className='text-red-400'><Link to='/'> Login </Link></span> </p>
        </div>
    </div>
  )
}

{/* <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-blur-sm bg-opacity-30 relative'>
            <h1 className='text-4xl text-whitefont-bold text-center mb-6'>Login</h1>
            <div>
            <div className='relative my-4'>
                    <input type="text" onChange={(e) => {setFirstName(e.target.value)}} className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-0 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                    <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:translate-y-6'>First Name</label>
                </div>
                <div className='relative my-4'>
                    <input type="text" onChange={(e) => {setLastName(e.target.value)}} className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-0 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                    <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:translate-y-6'>Last Name</label>
                </div>
                <div className='relative my-4'>
                    <input type="text" onChange={(e) => {setEmail(e.target.value)}} className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-0 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                    <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:translate-y-6'>Your Email</label>
                </div>
                <div className='relative my-4'>
                    <input type="text" onChange={(e) => {setPassword(e.target.value)}} className='block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-0 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''/>
                    <label htmlFor="" className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:translate-y-6'>Your Password</label>
                </div>
                {/* <div className='flex justify-center items-center'>
                    <div className='flex gap-2 items-center'>
                        <input type="checkbox" name='' id='' />
                        <label htmlFor="Rember Me">Remember Me</label>
                    </div>
                    <span className='text-blue-500'>Forgot Password?</span>
                </div> */}
        //         <button onClick={() => {handleChange()}} className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300' type='submit'>Register</button>
        //         <div>
        //             <span className='m-4'>Already Have An Account? <Link className='text-blue-500' to='/login'>Login</Link> </span>
        //         </div>
        //     </div>
        // </div> */}