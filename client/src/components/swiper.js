import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';

import io from 'socket.io-client';

const SwiperComponent = () => {
  
  const socket = io("https://chat-forte.vercel.app");
  const [olUsers, setOlUsers] = useState([])

  useEffect(() => {

    socket.on("online-users", onlineUsers => {

     setOlUsers(onlineUsers)
  
    });
    
    socket.emit("event");



  }, [])
 





   
 
  return (

    <div>

      <Swiper spaceBetween={20} slidesPerView={4} className='pt-3 pb-3 pe-2 ps-2'>

        {olUsers.map((val) => {
           
           return <SwiperSlide>{val.full_name}</SwiperSlide>

        })}

       


      </Swiper>
       
    </div>
  );
};

export default SwiperComponent;
