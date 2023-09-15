import { useEffect, useRef, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'js-cookie'


const PrivateRoutes = () => {

 

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const data = useRef()

  Axios.defaults.withCredentials = true
  

  useEffect(() => {

    const token = Cookies.get('token'); 

    if (token) {
      
      setIsAuthenticated(true);

    } else {
     
      setIsAuthenticated(false);

    }
  });

  


 
  return isAuthenticated ? <Outlet /> : <Navigate to='/' />;

};

export default PrivateRoutes
