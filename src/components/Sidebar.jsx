import React, { useContext, useState } from 'react'
import { Button, Modal } from 'antd';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = (props) => {

  let navigate = useNavigate()

    let ctx = useContext(UserContext);
    console.log(ctx)

     const [isModalOpen, setIsModalOpen] = useState(false);
     const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleOk = () => {
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

      const [details, setdetails] = useState({
        title:"",
        description:"",
        file:"",
      });

      console.log(details)

      

      const handleInputChanger=(e)=>{
          // console.log(e.target) 
          // console.log(e.target.name) 
          setdetails({...details, [e.target.name]:e.target.value})

      }

      // const handleFileChanger=(e)=>{
      //     let file = e.target.files[0];

      //     let reader = new FileReader();
      //     reader.readAsDataURL(file);

      //     reader.onload=()=>{
      //         setdetails({...details, file:reader.result})
      //     }

      //     reader.onerror=()=>{
      //       console.log(reader.result)
      //     }
      // }

      const [loading, setloading] = useState(false);

      const handleFileChanger = async(e)=>{
        setloading(true);
        let file = e.target.files[0];
        console.log(file)

        let formData = new FormData();
        formData.append('file',file);
        formData.append('upload_preset','mediaAgain')

        let res = await axios.post('https://api.cloudinary.com/v1_1/dsf7eyovf/upload',formData);
        let data = res.data
        console.log(data.secure_url);
        if(data.secure_url){
          setloading(false)
        }
        setdetails({...details, file:data.secure_url})
      }


      const handleSubmit = async()=>{
          let res = await axios.post('https://mediaapp-backend-jodl.onrender.com/api/posts/create',details,{
            headers:{
              'Authorization':ctx.userInfo.token
            }
          })

          let data = res.data
          console.log(data)
          if(data.success){
            toast.success(data.msg,{position:"bottom-right"})
            setIsModalOpen(false)
            setdetails({title:"", description:"", file:""})
            props.getAllPosts()
          }
          else{
            toast.error(data.msg,{position:"bottom-right"})
          }
      }
   
  return (
    <div className='sidebar text-white fixed left-0 top-[73px] w-[200px] h-full'>
      <ul>
        <li onClick={showModal}  className='text-center cursor-pointer p-2 border-b-2 text-balck border-green-300'>Create</li>
        <li onClick={()=>navigate('/profile')} className='text-center cursor-pointer p-2 border-b-2 text-balck border-green-300'>Profile</li>
      </ul>
      <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
           <div className='flex flex-col gap-3'>
           <label htmlFor="">Title</label>
            <input name='title' value={details.title} onChange={handleInputChanger} className='border-2 rounded-lg border-gray-200 outline-none py-2 px-4' type="text" />

            <label htmlFor="">Description</label>
            <textarea value={details.description} onChange={handleInputChanger} className='border-2 rounded-2xl border-gray-200 outline-none  py-2 px-4' name="description" id=""></textarea>

            <label htmlFor="file" className='bg-green-950 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 w-max'>Image\video</label>
            <input id='file' onChange={handleFileChanger} type="file"  hidden/>

       <div>
        {
          loading===true ? 'Loading...': <div>
             {details?.file &&  <div>
            {
               details.file.includes('image')
               ?
               <img className='w-1/2 mx-auto' src={details.file} alt="" />
               :
               <video className='w-1/2 mx-auto' controls src={details.file}></video>
             }
            </div>}
          </div>
        }
      
       </div>
            
         

            <button onClick={handleSubmit} className='bg-blue-950 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 '>submit</button>
           </div>
      </Modal>
    </div>
  )
}

export default Sidebar
