import React, { useEffect, useState } from 'react'
import UserContext from './UserContext';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import API_URL from '../config';
const UserState = (props) => {
    let userDetails = JSON.parse(localStorage.getItem('social'));

    const [userInfo, setuserInfo] = useState({
        login:userDetails? userDetails.login : false,
        token:userDetails ? userDetails.token : '',
        userId:userDetails ? userDetails.userId : '',
        user:""
    });
    console.log(userInfo)

    const getUserDetails = async()=>{
  
      let res = await axios.get(API_URL+'/api/users/getuser',{
        headers:{
          'Authorization':userInfo.token
        }
      })
      let data = res.data
     
      console.log(data) 


      if(data.success){
        console.log(data)
      setuserInfo({...userInfo,user:data.data})
     
      }
      else{
        console.log("error in get user details")
      }

    }

    useEffect(()=>{
      if(userInfo.token){
        getUserDetails()
      }
    },[userInfo.token])



    const AddUser=(ans)=>{
        console.log(ans)
        const decoded = jwtDecode(ans.token);
        console.log(decoded._id)
        localStorage.setItem('social' ,JSON.stringify({login:true, token:ans.token,userId:decoded._id}) )
    
        setuserInfo({login:true, token:ans.token,userId:decoded._id});

    }

    const logout=()=>{
        localStorage.removeItem('social');
        setuserInfo({login:false,userId:'', token:''})
    }
    
  return (
    <UserContext.Provider value={{userInfo,AddUser, logout,getUserDetails}}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserState
