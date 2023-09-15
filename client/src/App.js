import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import Register from './pages/registerPage';
import PrivateRoutes from './privateRoutes/privateRoute';
import Home from './pages/home';




function App() {



  return (

    <>


    <BrowserRouter>

      <Routes>

          <Route path='/' element={<LoginPage/>}/>
          <Route path='/register' element={<Register/>}/>

          <Route  element={<PrivateRoutes/>}>

            <Route  path='/welcome' element={<Home/>} exact>

          </Route>

          </Route>


      </Routes>

    </BrowserRouter>

 
      
    </>

  );
}

export default App;
