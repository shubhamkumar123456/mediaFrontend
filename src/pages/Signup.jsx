import React, { useState } from 'react'
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {

    let navigate = useNavigate()

    const [userDetails, setuserDetails] = useState({
        name:"",
        email:"",
        password:""
    });

    // console.log(userDetails)


    const handleInputChanger = (e)=>{
        let value = e.target.value;  //k
        let name = e.target.name;   //password

        // console.log(name) //PASSWORD
        // console.log(value)
        setuserDetails({...userDetails, [name]:value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(userDetails);

        let res = await fetch(API_URL+'/api/users/create',{
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(userDetails)
        });

        let data = await res.json();
        console.log(data)
        if(data.success){
            toast.success(data.msg,{position:'top-center'})
            navigate('/login')
        }
        else{
            toast.error(data.msg,{position:'top-center'})
        }

    }
  return (
   
        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
  <div className="hidden bg-cover lg:block lg:w-1/2" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80")'}} />
  <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
    <div className="flex justify-center mx-auto">
      <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt />
    </div>
    <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
      Welcome back!
    </p>
   
   
    <div className="mt-4">
      <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="name">Name</label>
      <input onChange={handleInputChanger} name='name' id="name" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300" type="text" />
    </div>
    <div className="mt-4">
      <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="LoggingEmailAddress">Email Address</label>
      <input name='email' onChange={handleInputChanger} id="LoggingEmailAddress" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300" type="email" />
    </div>
    <div className="mt-4">
      <div className="flex justify-between">
        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="loggingPassword">Password</label>
        <a href="#" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">Forget Password?</a>
      </div>
      <input name='password' onChange={handleInputChanger} id="loggingPassword" className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300" type="password" />
    </div>
    <div className="mt-6">
      <button onClick={handleSubmit} className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
        Sign Up
      </button>
    </div>
    <div className="flex items-center justify-between mt-4">
      <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
      <Link to="/login" className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline">or Log In</Link>
      <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4" />
    </div>
  </div>
</div>


  )
}

export default Signup
