/* importing the React library from the 'react' module. */
import React, { useEffect, useState } from "react";
import PageLoader from "../Components/PageLoader";

const AboutPage = () => {
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setisLoading(false);
    } ,2000);

    return () => clearTimeout(timer);
  }, []);


  // custum css for styling about page card
  const aboutStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: '2rem auto ',
      marginTop: "6rem" ,
      minHeight: "60vh",
      marginBottom:"8rem",
  };
  
    const titleStyle = {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    };
  
    const textStyle = {
      fontSize: '1.2rem',
      lineHeight: '1.5',
      textAlign: '',
      color:"black"
  };

  /*returning a JSX code block that renders the About page of the chat application.*/
  return (
    <div>
      {isLoading ? (<div className="loader-view" > <PageLoader/> </div>
      ):(

        <div style={aboutStyle} className="aboutStyle">
          <h2 style={titleStyle}>About React Chat App</h2>
          <p style={textStyle}>
            React Chat App is a simple and user-friendly chat application built using React.js. It allows users to communicate in real-time, share files, and stay connected with friends and colleagues. Our goal is to provide a seamless and enjoyable chatting experience for everyone.
          </p>
       </div>
      )}
    </div>
  );
};

/*  exporting the `AboutPage` component as the default export of this module. */
export default AboutPage;