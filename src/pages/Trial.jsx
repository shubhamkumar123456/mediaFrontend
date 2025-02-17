import React, { useEffect, useState } from 'react'

const Trial = () => {
    const [products, setproducts] = useState([]);
    console.log(products)  //[] , [194]

    async function getAllData(){
        let res =await fetch('https://dummyjson.com/products?limit=0')
       let data = await res.json();
    //    console.log(data.products)
       setproducts(data.products)
    }

  useEffect(()=>{
    getAllData()
  },[])

  const [themeOn, setthemeOn] = useState(false);

  const handleTheme = ()=>{
    setthemeOn(!themeOn)
  }

  return (
  <div className={`${themeOn===true ? 'bg-black': 'bg-white'}`}>

   {themeOn===false && <button onClick={handleTheme} className='bg-blue-400 text-white px-4 py-2 rounded-sm'>ON</button>}
   {themeOn===true && <button onClick={handleTheme} className='bg-green-400 text-white px-4 py-2 rounded-sm'>Off</button>}

      <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
     
     {
       products.map((ele, index)=>{
           return<div className={`${themeOn===true ? 'bg-black': 'bg-white'} flex max-w-md overflow-hidden rounded-lg shadow-lg`}>
 <div className="w-1/3 bg-cover" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80")'}} />
 <div className="w-2/3 p-4 md:p-4">
   <h1 className="text-xl font-bold text-gray-800 dark:text-white">Backpack</h1>
   <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit In odit</p>
   <div className="flex mt-2 item-center">
     <svg className="w-5 h-5 text-gray-700 fill-current dark:text-gray-300" viewBox="0 0 24 24">
       <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
     </svg>
     <svg className="w-5 h-5 text-gray-700 fill-current dark:text-gray-300" viewBox="0 0 24 24">
       <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
     </svg>
     <svg className="w-5 h-5 text-gray-700 fill-current dark:text-gray-300" viewBox="0 0 24 24">
       <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
     </svg>
     <svg className="w-5 h-5 text-gray-500 fill-current" viewBox="0 0 24 24">
       <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
     </svg>
     <svg className="w-5 h-5 text-gray-500 fill-current" viewBox="0 0 24 24">
       <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
     </svg>
   </div>
   <div className="flex justify-between mt-3 item-center">
     <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200 md:text-xl">$220</h1>
     <button className="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-700 dark:focus:bg-gray-600">Add to Cart</button>
   </div>
 </div>
</div>

       })
     }
   </div>
  </div>
  )
}

export default Trial
