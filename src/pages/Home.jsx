import React, { useContext, useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import UserContext from '../context/UserContext'
import { GoCommentDiscussion } from "react-icons/go";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Modal, Button } from "flowbite-react";
import { IoSend } from "react-icons/io5";
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { MdDeleteOutline } from "react-icons/md";

const Home = () => {
  // TimeAgo.addLocale(en);
  const [openModal, setOpenModal] = useState(false);
  let ctx = useContext(UserContext);
  let commentRef = useRef()
  // console.log(ctx)
  let token = ctx.userInfo.token
  let user = ctx.userInfo.user
  console.log(user)

  const [posts, setposts] = useState([]);
  console.log(posts)
  async function getAllPosts() {
    let res = await axios.get('https://mediaapp-backend-jodl.onrender.com/api/posts/getAllPost');
    let data = res.data;
    setposts(data.posts)
    // console.log(data.posts)

  }

  useEffect(() => {
    getAllPosts();
  }, [])

  const [selectedPost, setselectedPost] = useState("");

  const handleComment = (ele) => {
    console.log(ele)
    setselectedPost(ele)
    setOpenModal(true)
  }

  const [newComment, setnewComment] = useState("");

  const handleCommentChanger = (e) => {
    console.log(e.target.value)
    setnewComment(e.target.value)
  }

  const handleCommentSubmit = async (ele) => {
    // console.log(ele._id)
    let obj = {
      text: newComment
    }
    // console.log(obj)
    // console.log(token)

    let res = await axios.post(`https://mediaapp-backend-jodl.onrender.com/api/posts/comment/${ele._id}`, obj, {
      headers: {
        'Authorization': token
      }
    })
    let data = res.data;
    console.log(data)
    if (data.success) {
      toast.success(data.msg, { position: "bottom-right" })
      setnewComment("")
      getAllPosts()
    }
  }

  const handlecommentDelete = async(comment, post)=>{
    let commentId = comment._id
    let postId = post._id
    // console.log(commentId);
    // console.log(postId)
    console.log(comment)
    console.log(post)

    let res = await axios.delete(`https://mediaapp-backend-jodl.onrender.com/api/posts/deleteComment/${commentId}/${postId}`)
    let data = res.data;
    console.log(data)

    if(data.success){
      getAllPosts()
        let filteredArr=selectedPost.comments.filter((ele)=>ele._id!==comment._id)
        let copyObj = {...selectedPost}
        copyObj.comments = filteredArr
        setselectedPost(copyObj)
      toast.success(data.msg,{position:"top-center"})
    }
   
  }

  const handleLikes= async(postId)=>{
    console.log(postId)
    let res = await axios.put(`https://mediaapp-backend-jodl.onrender.com/api/posts/likepost/${postId}`,{},{
      headers:{
        'Authorization':token
      }
    })
    let data = res.data
    console.log(data)
    if(data.success){
      getAllPosts();
      toast.success(data.msg,{position:"bottom-right"})
    }
  }
  return (
    <div>
      <Sidebar getAllPosts={getAllPosts} />
      <div className='ml-[210px] flex flex-col items-center gap-5 '>
        {
          posts.map((ele, index) => {
            return <div className="w-[380px] py-4 px-6 relative overflow-hidden bg-white shadow-2xl rounded-lg border-2 dark:bg-gray-800">


              <div className="mt-4 ms-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <img className="object-cover h-10 rounded-full" src={ele.userId.profilePic} alt="Avatar" />
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
              <FaHeart onClick={()=>handleLikes(ele._id)} color='red' fill='red' size={24} />  
              :
              <CiHeart onClick={()=>handleLikes(ele._id)} color='red' fill='red' size={30}/>
              }
              <sup>{ele.likes.length}</sup>
                <div className='flex'>
                <GoCommentDiscussion onClick={() => handleComment(ele)} className='cursor-pointer' size={26} />
                <sup className='bg-blue-500 rounded-full w-5 h-5 flex justify-center items-center'>{ele.comments.length}</sup>
                </div>


              </div>
              <div className='py-3 px-5 gap-2 flex items-center'>
                <img src={user?.profilePic} className='w-12 h-12 rounded-full border-2' alt="" />
                <input value={newComment} onChange={handleCommentChanger} className='w-full border-2 outline-none focus:none h-8 rounded-md' placeholder='write your comment..' type="text" />
                <IoSend className='cursor-pointer' onClick={() => handleCommentSubmit(ele)} size={26} />
              </div>
            </div>

          })
        }

        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Comments...</Modal.Header>
          <Modal.Body>
            {
              selectedPost?.comments?.length > 0 ? <div className="space-y-6">
                {
                  selectedPost?.comments?.map((item) => {
                    return <div className="border relative rounded-md p-3 ml-3 my-3">
                      <div className="flex gap-3 items-center">
                        <img src={item.user.profilePic} className="object-cover w-8 h-8 rounded-full 
                                              border-2 border-emerald-400  shadow-emerald-400
                                              " />
                        <h3 className="font-bold">
                          {item.user.name}
                        </h3>

                      </div>
                      <p className="text-gray-600 mt-2">
                        {item.text}
                      </p>

                   { user._id===item.user._id &&  <MdDeleteOutline onClick={()=>handlecommentDelete(item,selectedPost)} className='absolute top-2 text-lg cursor-pointer right-5' />}
                    </div>


                  })
                }
              </div>
                :
                <h1 className='capitalize text-center text-xl'>No comments Available</h1>
            }
          </Modal.Body>
          <Modal.Footer>
            {/* <Button onClick={() => setOpenModal(false)}>I accept</Button> */}
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Decline
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    </div>
  )
}

export default Home
