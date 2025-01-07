import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import UserContext from '../context/UserContext';
import axios from 'axios';
import { io } from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
  let Endpoint = "https://mediaapp-backend-jodl.onrender.com"
  const socketRef = useRef();
  // let socket = io(Endpoint,{transports:['websocket']});
    let location = useLocation();
    let userStore = useContext(UserContext);
    console.log(userStore)
    let token = userStore.userInfo.token;
   let friendId = location.state._id;

   let inputRef = useRef()

   console.log(token)
   console.log(friendId)

   const [allchat, setallchat] = useState([]);
   console.log(allchat)
   const getChat = async()=>{
    let res = await axios.get(`https://mediaapp-backend-jodl.onrender.com/api/message/getchat/${friendId}`,{
        headers:{
            'Authorization':token
        }
    })

    let data = res.data
    console.log(data.chat)
    setallchat(data.chat)
   }

   useEffect(()=>{
    getChat()
   },[])

   useEffect(()=>{
    socketRef.current = io("https://mediaapp-backend-jodl.onrender.com", { transports: ["websocket"] });
    socketRef.current.emit('addUser',userStore?.userInfo.userId)
   },[])


 

   const handleSend = async()=>{

    socketRef.current.emit('sendMessage',{friendId,userId:userStore?.userInfo?.userId,message:inputRef.current.value})
       
        let obj = {
            text: inputRef.current.value
        }
        let res = await axios.post(`https://mediaapp-backend-jodl.onrender.com/api/message/sendmessage/${friendId}`,obj,{
            headers:{
                'Authorization':token
            }
        })

        let data = res.data;
        console.log(data)
        if(data.success){
            inputRef.current.value = ""
            getChat() 
        }
   }

  //  useEffect(()=>{
   
  //  },[handleSend])
  const [newMessage, setnewMessage] = useState("");

  useEffect(() => {
    socketRef.current.on("getMessage", ({ userId, friendId, message }) => {
      console.log({ userId, friendId, message });
      setnewMessage({ userId, friendId, text:message, createdAt:Date.now() })
    });
  }, []);

  useEffect(()=>{
    if(newMessage){
      setallchat([...allchat,newMessage])
    }
  },[newMessage])

  return (
    <div className=''>
   <ScrollToBottom className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-[600px]">
  <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
    <div className="relative flex items-center space-x-4">
      <div className="relative">
        <span className="absolute text-green-500 right-0 bottom-0">
          <svg width={20} height={20}>
            <circle cx={8} cy={8} r={8} fill="currentColor" />
          </svg>
        </span>
        <img className='w-12 h-12 rounded-full' src={userStore.userInfo?.user?.profilePic} />
      </div>
      <div className="flex flex-col leading-tight">
        <div className="text-2xl mt-1 flex items-center">
          <span className="text-gray-700 mr-3">{userStore.userInfo?.user?.name}</span>
        </div>
        {/* <span className="text-lg text-gray-600">{userStore.userInfo?.user?.bio}</span> */}
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
    </div>
  </div>
  <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
  {
    allchat.map((ele)=>{
        return ele.userId===userStore?.userInfo?.userId ? <div className="chat-message">
        <div className="flex items-end justify-end">
          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
            <div><span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{ele.text}</span>
            <p>{formatDistanceToNow(ele.createdAt, { addSuffix: true })}</p>
            </div>
          </div>
          <img src={userStore?.userInfo?.user?.profilePic} alt="My profile" className="w-6 h-6 rounded-full order-2" />
        </div>
      </div>
      :
      <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{ele.text}</span>
          <p>{formatDistanceToNow(ele.createdAt, { addSuffix: true })}</p>
          </div>
        </div>
        <img src={location.state.profilePic} alt="My profile" className="w-6 h-6 rounded-full order-1" />
      </div>
    </div>
    })
  }



   
  
 
  </div>
  <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
    <div className="relative flex">
      <span className="absolute inset-y-0 flex items-center">
        <button type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </span>
      <input ref={inputRef} type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
      <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
        <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button onClick={handleSend} type="button" className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
          <span className="font-bold">Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</ScrollToBottom>

    </div>
  )
}

export default Chat
