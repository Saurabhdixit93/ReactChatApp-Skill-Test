/* importing the React library from the 'react' module And All important modules */
import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import PageLoader from "../Components/PageLoader";
import { Link } from "react-router-dom";


const ProfilePage = () => {
  
  const { currentUser } = useAuth();

  const [isLoading, setisLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setisLoading(false);
    } ,2000);

    return () => clearTimeout(timer);
  }, []);

  if(currentUser){
    useEffect(() => {
      const image = new Image();
      image.src = currentUser.photoURL;
      image.onload = () => {
        setIsImageLoading(false);
      }
    },[currentUser.photoURL]);
  }



  /*returning a JSX code block that renders the ProfilePage of the chat application.*/

  return (
    <div>
      {isLoading ? (<div className="loader-view" > <PageLoader/> </div>):(
        <div className="profile-page-container">
            <div className="profile-page-box">
                {/* image profile */}

                <div className="profile-page-image-box">
                  {currentUser && (
                    <>
                    {isImageLoading ? (
                      <>
                        <div className="loaderImage"></div>
                        < img src="https://img.icons8.com/ios-filled/50/user-male-circle.png"  className="profile-page-image"/>
                      </>
                    ): (
                      <img src={currentUser.photoURL} className="profile-page-image" style={{pointerEvents:"none"}} />  
                    )}
                    </>
                  )}
                </div>

                {/* end */}
               
                <div className="profle-page-details-box">
                    <form className="profle-page-details">
                        <div className="user-name-details">
                            <input type="text" id="username" className="user-name" value={currentUser.displayName} readOnly />
                        </div>
                        <div className="user-email-details">
                            <input type="text" className="user-email" value={currentUser.email} readOnly />
                        </div>
                    </form>
                    <div className="change-route">
                        <Link className="change-route-button" to={"/update"} > 
                            <button> <i className="fa fa-edit"></i> Update Profile</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
     )}
    </div>
  );
};

/*  exporting the `ProfilePage` component as the default export of this module. */
export default ProfilePage;