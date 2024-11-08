import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  async function logout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className='flex bg-gradient-to-r from-custom-200 via-custom-300 to-custom-400 shadow-md py-4 px-8 justify-between items-center'>
      <div className='flex gap-6 h-16 items-center'>
        <h1 className='text-2xl font-semibold font-serif'>
          <Link
            to='/homepage'
            className='text-white transition transform hover:scale-105 hover:text-gray-200'
          >
            Todo
          </Link>
        </h1>
        <h1 className='text-2xl font-semibold font-serif'>
          <Link
            to='/tracker'
            className='text-white transition transform hover:scale-105 hover:text-gray-200'
          >
            Tracker
          </Link>
        </h1>
      </div>
      <div className='flex h-16 items-center'>
        <button
          onClick={logout}
          className='bg-custom-300 text-white p-3 rounded-full shadow-lg transition transform hover:bg-custom-400 hover:scale-105'
        >
          Logout
        </button>
      </div>
    </div>
  );
}
