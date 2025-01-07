import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { CiCamera } from "react-icons/ci";
import { toast } from 'react-toastify';

const Profile = () => {

    let ctx = useContext(UserContext);
    console.log(ctx.userInfo.token)
    let userId = ctx.userInfo.userId

    const [userInfo, setuserInfo] = useState("");
    console.log(userInfo)

    async function getUserData(){
            let res = await axios.get('https://mediaapp-backend-jodl.onrender.com/api/users/getUser',{
                headers:{
                    'Authorization':ctx.userInfo.token
                }
            })
            let data = res.data;
            setuserInfo(data.data)

    }

    const [allPosts, setAllPosts] = useState([]);
    console.log(allPosts)
    async function yourPosts() {
        let res = await axios.get('https://mediaapp-backend-jodl.onrender.com/api/posts/getYourPost',{
            headers:{
                'Authorization':ctx.userInfo.token
            }
        })
        let data = res.data;
        console.log(data.post)
        setAllPosts(data.post)
    }

    useEffect(()=>{
        yourPosts()
    },[])

    useEffect(()=>{
        getUserData()
    },[])


    const handleProfileChanger =async(e)=>{
      let file = e.target.files[0];
      console.log(file)

      let formData = new FormData();
      formData.append('file',file)
      formData.append('upload_preset','mediaAgain')

      let res = await axios.post('https://api.cloudinary.com/v1_1/dsf7eyovf/upload',formData);
      let data = res.data
      console.log(data.secure_url);
      if(data.secure_url){
        let res1 = await axios.put(`https://mediaapp-backend-jodl.onrender.com/api/users/update/${userId}`,{profilePic:data.secure_url},{
          headers:{
            'Authorization':ctx.userInfo.token
          }
        })
        let data1 =  res1.data
          if(data1.success){
            getUserData()
              toast.success(data1.msg,{position:"top-center"})
          }
          else{
            toast.error(data1.msg,{position:"top-center"})
          }
      }
      else{
        toast.error('unable to upload image',{position:"top-center"})
      }
    }

    const handleInfoUpdater = (e)=>{
        // e.target -->tag
        // e.target.name -->tag name
        // e.target.value -->tag value
        setuserInfo({...userInfo , [e.target.name]:e.target.value})
    }

    const handleUpdateSubmit = async(e)=>{
      e.preventDefault()
      let res = await axios.put(`https://mediaapp-backend-jodl.onrender.com/api/users/update/${userId}`,userInfo,{
        headers:{
          'Authorization':ctx.userInfo.token
        }
      })
      let data =  res.data
        if(data.success){
          getUserData()
            toast.success(data.msg,{position:"top-center"})
        }
        else{
          toast.error(data.msg,{position:"top-center"})
        }
    }
  return (
    <div className='w-[85%] mx-auto'>
     <div className=''>
     <div className="coverPicBox h-[20vw] relative">
        <img className='h-full w-full' src={userInfo?.coverPic} alt="" />

        <div className='profilePicBox absolute w-40 h-40 rounded-full bg-red-500  left-[50%] translate-x-[-50%] -bottom-20'>
            <img src={userInfo?.profilePic} className='w-full h-full rounded-full' alt="" />
            <input onChange={handleProfileChanger} type="file" id='profilePic' hidden />
            <label htmlFor="profilePic" className='absolute right-0 top-7'> <CiCamera className='cursor-pointer' color='red' size={30}/></label>
        </div>
      </div>

      <div className='flex flex-col items-center'>
        <h1 className='profileName capitalize mt-[80px] text-center font-bold text-2xl'>{userInfo?.name}</h1>
        <h1 className='profileName capitalize  text-center font-bold text-2xl'>{userInfo?.bio}</h1>

        <div className='flex gap-9'>
        <div className='flex flex-col items-center'><h3 className='font-bold'>Followers</h3> <p>{userInfo?.followers?.length}</p> </div>
        <div className='flex flex-col items-center'><h3 className='font-bold'>Followings</h3> <p>{userInfo?.followings?.length}</p> </div>
        </div>
      </div>
     </div>

{/* card code starts here************** */}
<div className='flex mt-5'>
  <div className='w-max ms-6 h-max p-4  bg-yellow-400 rounded-lg'>
    <form action="" >
      <label className='w-[70px] mb-4 inline-block' htmlFor="">Name:</label>
      <input  className='px-3 py-2 rounded-md border-2 border-gray-400' onChange={handleInfoUpdater} name='name' value={userInfo?.name} type="text" /> <br />
      <label className='w-[70px] mb-4 inline-block' htmlFor="">Email:</label>
      <input className='px-3 py-2 rounded-md border-2 border-gray-400' name='email' onChange={handleInfoUpdater} value={userInfo?.email} disabled type="email" /> <br />
      <label className='w-[70px] mb-4 inline-block' htmlFor="">Bio:</label>
      <textarea className='px-3 py-2 rounded-md border-2 border-gray-400'  onChange={handleInfoUpdater} value={userInfo?.bio} name="bio" id=""></textarea> <br />
      <label  className='w-[70px] mb-4 inline-block' htmlFor="">Password:</label>
      <input className='px-3 py-2 rounded-md border-2 border-gray-400' type="password" onChange={handleInfoUpdater} name='password'/> <br />
      <button onClick={handleUpdateSubmit} className='bg-blue-950 w-full  text-white rounded-md px-3 py-2 hover:bg-blue-800'>update info</button>
    </form>
  </div>
  <div className='ml-[100px] flex flex-col items-center gap-5 '>
          {
           allPosts .map((ele,index)=>{
              return<div className="w-[350px] overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
            
          {  ele.file.includes('image')
            ?
 
  <img className="object-contain w-full h-64" src={ele.file} alt="Article" />
:
  ele.file.includes('video')?
  <video controls src={ele.file} className='object-cover w-full h-64'></video>
:''
}
  <div className="p-6">
    <div>
      {/* <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">Product</span> */}
      <a href="#" className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline" tabIndex={0} role="link">{ele.title}</a>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{ele.description}</p>
    </div>
    <div className="mt-4">
      <div className="flex items-center">
        <div className="flex items-center">
          <img className="object-cover h-10 rounded-full" src={ele.userId.profilePic} alt="Avatar" />
          <a href="#" className="mx-2 font-semibold text-gray-700 dark:text-gray-200" tabIndex={0} role="link">{ele.userId.name}</a>
        </div>
        <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">21 SEP 2015</span>
      </div>
    </div>
  </div>
</div>

            })
          }
        </div>
</div>

    </div>

 
  )
}

export default Profile
