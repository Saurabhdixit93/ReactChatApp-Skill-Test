/* importing the React library from the 'react' module And All important modules */
import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import PageLoader from "../Components/PageLoader";


const HomePage = () => {
  
  const {currentUser} = useAuth();

  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setisLoading(false);
    } ,2000);

    return () => clearTimeout(timer);
  }, []);



  /*returning a JSX code block that renders the home page of the chat application.*/

  return (
    <div>
      {isLoading ? (<div className="loader-view" > <PageLoader/> </div>):(
        <div className="home-page">
          <main className="main">
            <h2 className="welcome-text">Welcome to ReactChat App!</h2>
            <p className="description">
              Start chatting with your friends and family in real-time.
            </p>
            {currentUser && (
              <Link className="start-button" style={{textDecoration:'none'}} to={"/chats"}>
               Start Chatting
              </Link>
            )}
            {! currentUser && (
              <Link className="start-button" style={{textDecoration:'none'}} to={"/login"}>
               Login
              </Link>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

/*  exporting the `HomePage` component as the default export of this module. */
export default HomePage;