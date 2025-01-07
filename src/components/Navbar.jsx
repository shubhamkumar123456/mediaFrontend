import React, { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {

  const [showDropDown, setshowDropDown] = useState(false);
    let userCtx = useContext(UserContext)
    console.log(userCtx)
    let id = userCtx.userInfo.userId
    console.log(id)
    let login = userCtx.userInfo.login

    let navigate = useNavigate()

    const [friendsUsers, setfriendsUsers] = useState([]);
    
    const handleInputChanger=async(e)=>{
        console.log(e.target.value)
        let res = await axios.get(`https://mediaapp-backend-jodl.onrender.com/api/users/username?q=${e.target.value}`)
        let data = res.data;
        console.log(data)
      setfriendsUsers(data)
    }
  return (
    <div>
   <nav className="bg-gradient-to-r h-[73px]  from-blue-500 via-purple-500 to-pink-500 z-50 fixed top-0 left-0 right-0  p-4 shadow-lg">
  <div className="container mx-auto flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="text-white text-2xl font-bold">SocialApp</Link>
    {/* Search Bar */}
    <div className="hidden md:flex items-center w-1/3 relative">
      <input onChange={handleInputChanger} type="text" placeholder="Search for users..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <ul className='bg-gradient-to-r rounded-lg from-blue-500 via-purple-500 to-pink-500 w-full  absolute top-full'>
        {
          friendsUsers.map((friend)=>{
            return friend._id!==id && <Link state={friend._id} onClick={()=>setfriendsUsers([])} to={'/friendProfile'} className='cursor-pointer rounded-lg flex px-2 items-center py-2 border-b-2 gap-6'>
              <img className='w-11 h-11 rounded-full' src={friend.profilePic} alt="" />
              <p className='capitalize'>{friend.name}</p>
            </Link>
          })
        }
      </ul>
    </div>
    {/* Navigation Links and Dropdown */}
    <div className="hidden md:flex items-center space-x-6">
      
      {/* Dropdown Menu */}
      <div className="relative">
       
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded shadow-lg hidden" id="user-menu">
          <a href="/login" className="block px-4 py-2 hover:bg-gray-100">Login</a>
          <a href="/signup" className="block px-4 py-2 hover:bg-gray-100">Signup</a>
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
       
        </div>
      </div>
      <div className=' relative '>
    <img onClick={()=>setshowDropDown(!showDropDown)} className='w-10 h-10 rounded-full' src={userCtx.userInfo?.user?.profilePic?userCtx.userInfo.user.profilePic:"https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="} alt="" />

   {showDropDown===true && <div className='dropDownBox  absolute top-[120%] right-0 bg-gradient-to-r  from-blue-500 via-purple-500 to-pink-500 '>
        <ul >
      {login===true &&    <li className=' border-b-2 border-b-black py-2 px-5 '><Link to="/profile">Profile</Link></li>}
         {login===false && <li className=' border-b-2 border-b-black  py-2 px-5 '><button className='' onClick={()=>navigate('/login')}>Login</button></li>}
        { login===true && <li onClick={()=>userCtx.logout()} className=' border-b-2 border-b-black  py-2 px-5 '><button className=''>Logout</button></li>}
{    login ===false && <li className=' border-b-2 border-b-black  py-2 px-5 '><button onClick={()=>navigate('/register')} className=''>Signup</button></li>}
        </ul>
    </div>}
  </div>
    </div>
    {/* Mobile Menu Toggle */}
    <button className="block md:hidden text-white" id="menu-toggle">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
      </svg>
    </button>
  </div>
  {/* Mobile Dropdown Menu */}
  <div className="md:hidden bg-white text-blue-500 space-y-2 px-4 py-3 hidden" id="mobile-menu">
    <a href="#" className="block hover:text-blue-700">Home</a>
    <a href="#" className="block hover:text-blue-700">About</a>
    <a href="#" className="block hover:text-blue-700">Contact</a>
    <a href="/profile" className="block hover:text-blue-700">Profile</a>
  </div>

 
</nav>


    </div>
  )
}

export default Navbar
