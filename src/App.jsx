import React from "react";
import { BrowserRouter, Navigate, Route ,Routes } from "react-router-dom"
import Login from "./Pages/LoginPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import Register from "./Pages/RegisterPage";
import AboutPage from "./Pages/AboutPage"
import { useAuth } from "./Context/AuthContext";
import { AuthRedirect } from "./Context/AuthRedirect";
import UpdateUserDetails from "./Pages/UpdateDetails";
import NotFound from "./Pages/Page404";
import ProfilePage from "./Pages/ProfilePage";
import  Chat  from "./Pages/ChatPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App (){

  const {currentUser} = useAuth();
  const AuthRoute = ({children}) => {
    return currentUser ? children : <Navigate to={"/login"}/>
  };

  return (
    <div style={{fontFamily: 'Avenir'}}>
    <>
    <div>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route index path="/" element={ <HomePage/>} />
          <Route path="/register" element={<AuthRedirect><Register/></AuthRedirect>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/update" element={<UpdateUserDetails/>} />
          <Route path="*" element={<NotFound/>} />
          <Route path="/chats" element={<AuthRoute> <Chat/> </AuthRoute>} />
          <Route path="/user-profile" element={<AuthRoute> <ProfilePage/> </AuthRoute>} />
        </Routes>
      </BrowserRouter>
      <Footer/> 
    </>
    </div>
  );
}

export default App;