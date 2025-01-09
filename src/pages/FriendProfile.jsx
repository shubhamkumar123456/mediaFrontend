import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { CiCamera } from "react-icons/ci";
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { IoSend } from "react-icons/io5";
import API_URL from '../config';
const FriendProfile = () => {

  let ctx = useContext(UserContext);
  console.log(ctx)
  let userId = ctx.userInfo.userId
  let user = ctx.userInfo.user
        let location = useLocation();
        console.log(location.state);


        const [friend, setfriend] = useState("");
        const [friendPost, setfriendPost] = useState([]);
        console.log(friendPost)
        console.log(friend);

       async function getFriendUser(){
        let res = await axios.get(`${API_URL}/api/users/getuser/${location.state}`)
        let data = res.data
        if(data.success){
            // console.log(data)
            setfriend(data.friend)
        }
        }

       async function getFriendPosts(){
        let res = await axios.get(`${API_URL}/api/posts/getFriendPost/${location.state}`)
        let data = res.data
        // console.log(data)
        if(data.success){
            // console.log(data)
            setfriendPost(data.posts)
        }
        }


      
        useEffect(()=>{
            getFriendUser()
        },[location.state])

        useEffect(()=>{
            getFriendPosts()
        },[location.state])

 
        const handleFollow = async()=>{
          let res = await axios.post(`${API_URL}/api/users/followuser/${friend._id}`,{},{
            headers:{
              'Authorization':ctx.userInfo.token
            }
          })
          let data = res.data;
          console.log(data)
          if(data.success){
            getFriendUser()
          }
        }
  return (


<div className='w-[85%] mx-auto'>
    <div className=''>
        <div className="coverPicBox h-[20vw] relative">
           <img className='h-full w-full' src={friend?.coverPic} alt="" />
   
           <div className='profilePicBox absolute w-40 h-40 rounded-full bg-red-500  left-[50%] translate-x-[-50%] -bottom-20'>
               <img src={friend?.profilePic} className='w-full h-full rounded-full' alt="" />
              
           </div>
         </div>
   
         <div>
           <h1 className='profileName capitalize mt-[80px] text-center font-bold text-2xl'>{friend?.name}</h1>
           <h1 className='profileName capitalize  text-center font-bold text-2xl'>{friend?.bio}</h1>
          
         
         <div className='flex justify-center gap-10'>
          <div className='flex flex-col items-center font-bold'><p>Followers</p> <span>{friend?.followers?.length}</span></div>
          <div className='flex flex-col items-center font-bold'><p>Followings</p> <span>{friend?.followings?.length}</span></div>
         </div>
         <div className='flex justify-center'>
          {friend?.followers?.includes(userId) ? <button onClick={handleFollow} className='bg-green-900 px-4 py-2 hover:bg-green-950 rounded-md text-white'>Unfollow</button>
          :
           <button onClick={handleFollow} className='bg-green-900 px-4 py-2 hover:bg-green-950 rounded-md text-white'>Follow</button>}

           <Link to={'/chat'} state={friend} className='bg-purple-600 px-4 ms-3 py-2 rounded-md hover:bg-purple-900 text-white'>Chat</Link>
           </div>

         </div>
        </div>

      <div className='flex flex-col items-center gap-4 mt-7'>
        {
          friendPost.map((ele)=>{
            return  <div className="w-[380px] py-4 px-6 relative overflow-hidden bg-white shadow-2xl rounded-lg border-2 dark:bg-gray-800">
            
            
                          <div className="mt-4 ms-4">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <img className="object-cover h-10 rounded-full" src={friend?.profilePic} alt="Avatar" />
                                <a href="#" className="mx-2 font-semibold text-gray-700 dark:text-gray-200" tabIndex={0} role="link">{ele.userId.name}</a>
                              </div>
                              <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">{formatDistanceToNow(ele.createdAt, { addSuffix: true })}</span>
                            </div>
                          </div>
                          {ele.file.includes('image')
                            ?
            
                            <img className="object-contain w-full h-64" src={ele.file} alt="Article" />
                            :
                            ele.file.includes('video') ?
                              <video controls src={ele.file} className='object-cover w-full h-64'></video>
                              : ''
                          }
                          <div className="p-6">
                            <div>
                              {/* <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">Product</span> */}
                              <a href="#" className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline" tabIndex={0} role="link">{ele.title}</a>
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{ele.description}</p>
                            </div>
            
                          </div>
                          <div className=' flex  gap-2 ms-4 items-center '>
                          {
                          ele.likes.includes(user._id) ?
                          <FaHeart  color='red' fill='red' size={24} />  
                          :
                          <CiHeart  color='red' fill='red' size={30}/>
                          }
                          <sup>{ele.likes.length}</sup>
                            <div className='flex'>
                            <GoCommentDiscussion  className='cursor-pointer' size={26} />
                            <sup className='bg-blue-500 rounded-full w-5 h-5 flex justify-center items-center'>{ele.comments.length}</sup>
                            </div>
            
            
                          </div>
                          <div className='py-3 px-5 gap-2 flex items-center'>
                            <img src={user?.profilePic} className='w-12 h-12 rounded-full border-2' alt="" />
                            <input className='w-full border-2 outline-none focus:none h-8 rounded-md' placeholder='write your comment..' type="text" />
                            <IoSend className='cursor-pointer'  size={26} />
                          </div>
                        </div>
          })
        }
      </div>
</div>
 
  )
}

export default FriendProfile
