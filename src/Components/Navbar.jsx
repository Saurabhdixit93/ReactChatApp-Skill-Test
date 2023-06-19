/* importing the React library and the useState hook from the 'react' module. */
import React, {useState ,useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from 'react-router-dom';
import  { showNotificationForOffline , showNotificationForOnline ,showNotificationForLogoutSuccess} from "./Notifications";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {currentUser} = useAuth();
  const navigate = useNavigate();

  const [isImageLoading, setIsImageLoading] = useState(true);


    useEffect(() => {
      const notifyNoInternet = () => {
        showNotificationForOffline();
      }
      const notifyConnectInternet = () => {
        showNotificationForOnline();
      }
      window.addEventListener('offline' , notifyNoInternet);
      window.addEventListener('online', notifyConnectInternet);
      return () => {
        window.removeEventListener('offline' , notifyNoInternet);
        window.removeEventListener('online', notifyConnectInternet);
      };
    },[]);

  if(currentUser){
    useEffect(() => {
      const image = new Image();
      image.src = currentUser.photoURL;
      image.onload = () => {
        setIsImageLoading(false);
      }
    },[currentUser.photoURL]);
  }

  /* The function handles user logout by signing out the user, displaying an alert message, and redirecting to the login page.*/
  const handleLogout = async (e) => {
    await signOut(auth);
    showNotificationForLogoutSuccess();
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    },2000)
  };

  /* This function toggles the state of a menuOpen variable.*/
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  /* This is the JSX code that defines the structure and content of a Navbar component.*/
  return (
    <nav className="navbar">
      
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/" style={{textDecoration:'none'}}>ReactChat App</a>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <i className={menuOpen ? 'fa fa-times' : 'fa fa-bars'}></i>
        </div>
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to={"/"} className="navbar-link" style={{textDecoration:"none"}}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to={"/about"} className="navbar-link" style={{textDecoration:"none"}}>
              About
            </Link>
          </li>
          {currentUser && (
            <>
            <li className="navbar-item">
             <Link to={'/user-profile'} style={{cursor:'pointer',textDecoration:"none",textTransform:"uppercase"}} className="navbar-link"> {currentUser.displayName}</Link>
            </li>
            <li className="navbar-item">
              <Link to={"/update"} className="navbar-link" style={{textDecoration:"none"}}>
                Update Details
              </Link>
            </li>
            {currentUser &&(
            <li className="navbar-item">
              {/* <a style={{}} className="navbar-link" onClick={handleLogout}>Logout</a> */}
              <span className="navbar-link" onClick={handleLogout} style={{textDecoration:"none",cursor:'pointer'}}>
                Logout
              </span>
            </li>
            )}
            <li className="profileImage">
              <>
                {isImageLoading ? (
                  < img src="https://img.icons8.com/ios-filled/50/user-male-circle.png"  className="User-Profile-pic" alt="random"/>
                ): (
                  <img src={currentUser.photoURL} className="User-Profile-pic" style={{pointerEvents:"none"}}  />  
                )}
              </>
            </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

/* exporting the `Navbar` component as the default export of this module.*/
export default Navbar;
