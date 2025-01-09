import React, { useContext, useRef, useState } from 'react'
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import UserContext from '../context/UserContext';
import API_URL from '../config';
const Login = () => {

  let userCtx = useContext(UserContext);
  console.log(userCtx)

    let navigate = useNavigate()

    let emailRef = useRef();
    let passwordRef = useRef();


    const handleSubmit = async(e)=>{
        e.preventDefault();

        let obj = {
            email:emailRef.current.value,
            password:passwordRef.current.value
        }

        console.log(obj)

        let res = await axios.post(API_URL+'/api/users/login',obj);
        console.log(res.data) // {msg:"login successfull", success:true, token:"56789cvb"}
        if(res.data.success){
          userCtx.AddUser(res.data)
            // navigate('/')
            toast.success(res.data.msg, {position:"top-center", theme:"dark"})
        }
        else{
            toast.error(res.data.msg, {position:"top-center", theme:"colored"})
        }
    }
  return (
   
        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
  <div className="hidden bg-cover lg:block lg:w-1/2" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80")'}} />
  <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
    <div className="flex justify-center mx-auto">
      <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg"  />
    </div>
    <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
      Welcome back!
    </p>
   
   
 
    <div className="mt-4">
      <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="LoggingEmailAddress">Email Address</label>
      <input ref={emailRef} name='email' id="LoggingEmailAddress" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300" type="email" />
    </div>
    <div className="mt-4">
      <div className="flex justify-between">
        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="loggingPassword">Password</label>
        <Link to="/forgetpassword" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">Forget Password?</Link>
      </div>
      <input ref={passwordRef} name='password'  id="loggingPassword" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300" type="password" />
    </div>
    <div className="mt-6">
      <button onClick={handleSubmit} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
        Sign In
      </button>
    </div>
    <div className="flex items-center justify-between mt-4">
      <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
      <Link to="/register" className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline">or sign up</Link>
      <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
    </div>
  </div>
</div>


  )
}

export default Login
