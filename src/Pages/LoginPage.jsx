/* This code is importing necessary modules and functions from various libraries and files. */
import React, {useEffect, useState } from "react";
import { GoogleOutlined, FacebookFilled } from "@ant-design/icons"
import "firebase/auth"
import { Link, useNavigate} from "react-router-dom";
import { auth } from "../firebase";
import { FacebookAuthProvider, signInWithEmailAndPassword , signInWithPopup,GoogleAuthProvider} from "firebase/auth";
import PageLoader from "../Components/PageLoader";
import { showNotificationForLoginError, showNotificationForLoginSuccess } from "../Components/Notifications";




const Login = () => {
    const [togglIcon , setToggleIcon] = useState(false);
    const [loading , setLoading] = useState(false);
    /* The `inputs` state variable is an object with two properties: `email` and `password`, both of which are initially set to empty strings.
    The `setInputs` function is used to update the `inputs` state variable. */
    const [inputs , setInputs] = useState({
        email: "",
        password: "",
    });
   

    const navigate = useNavigate();
    /**
     * This function updates the state of inputs by setting the value of the input with the name
     * attribute equal to the value of the target element.
     */
    const handleFormChange = (e) => {
       setInputs((prev) =>({...prev ,[e.target.name]:e.target.value}))
    };

    const [inputType,  setInputType] = useState("password");

    /**
     * This function toggles the visibility of a password input field in a React component.
     */
    const handlePassShow = (e) => {
        setToggleIcon(!togglIcon);
        setInputType(inputType === "password" ? "text" : "password")
    };

  /**
   * This function handles the login process by calling the signInWithEmailAndPassword function with
   * the auth object, email, and password values, and then navigating to the home page if successful or
   * throwing an error if unsuccessful.
   */
    // const handleLogin = async (e) =>{

    //     setLoading(true);
    //     e.preventDefault();
        
    //     try {
    //     // Call the signInWithEmailAndPassword function with the auth object, email, and password values
    //     await signInWithEmailAndPassword(auth,inputs.email,inputs.password);
    //     showNotificationForLoginSuccess();
    //     // Navigate to the home page
    //     navigate('/');
    //     window.location.reload();
    //     } catch (error) {
    //         setLoading(false);
    //         showNotificationForLoginError(error.message);
    //         setisLoading(true);
    //         setTimeout(() => {
    //             setisLoading(false);
    //         },4000);
    //     }
    // };



    // media login
    
    const signIn = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            return error;
        }
    };
    
    const navigateToHome = () => {
        navigate('/');
        window.location.reload();
    };
    
    const handleLoading = (isLoading) => {
        setLoading(isLoading);
        if (isLoading) {
            setTimeout(() => {
                setLoading(false);
            }, 4000);
        }
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        handleLoading(true);
    
        const result = await signIn(inputs.email, inputs.password);
    
        if (result === true) {
            showNotificationForLoginSuccess();
            navigateToHome();
        } else {
            handleLoading(false);
            showNotificationForLoginError(result.message);
            handleLoading(true);
        }
    };
    
    const MediaGoogleLogin = async (e) => {
        e.preventDefault();
        try{
            const provider = new GoogleAuthProvider();
            const userData = await signInWithPopup(auth, provider);
            showNotificationForLoginSuccess();
            setTimeout(() => {
                window.location.reload();
            },3000);
            // Navigate to the home page
            navigate('/');

        }catch(error){
            if(error){
                showNotificationForLoginError(error.message);
                setisLoading(true);
                setTimeout(() => {
                    setisLoading(false);
                },4000);
            };
        }
    };

    // Facebook login

    const MediaFacebookLogin = async (e) => {

        e.preventDefault();
        try{
            const provider = new FacebookAuthProvider();
            const userData = await signInWithPopup(auth, provider);
            showNotificationForLoginSuccess();
            setTimeout(() => {
                window.location.reload();
            },3000);
            // Navigate to the home page
            navigate('/');

        }catch(error){
            
            if(error){
                showNotificationForLoginError(error.message);
                setisLoading(true);
                setTimeout(() => {
                    setisLoading(false);
                },4000);
            };
        }
    };

    // for prev loader

    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setisLoading(false);
      } ,2000);

      return () => clearTimeout(timer);
    }, []);


    /* The `return` statement is returning a JSX code that represents the UI of the Login component. */
    return (
        <div>
            {isLoading ? ( <div className="loader-view" > <PageLoader/> </div>
            ):(

            <div className="Register-page">
                <form className="register-form" onSubmit={handleLogin} >
                    <div style={{textAlign:"center"}}>
                        <h2>Login Page</h2>
                    </div>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter Your Email..." 
                        id="email"
                        onChange={handleFormChange}
                        required
                    />
                    <div className="formInput">
                        <input 
                            type={inputType} 
                            name="password" 
                            placeholder="Enter Your Password..." 
                            id="password" 
                            onChange={handleFormChange}
                            required 
                        />
                        <div className="eyeIcon" onClick={handlePassShow}>
                            <i className={togglIcon ? 'fa fa-eye' : 'fa fa-eye-slash'}></i>
                        </div>
                    </div>
                    <button type="submit" className="register-button">{loading ? <div className="loadingregister"> <span className="focus"> Login wait.. </span><i class="fa fa-spinner fa-spin"></i> </div> : "Login"}</button>
                    <br />

                    <div className="Path-Login">
                        <Link style={{textDecoration:'none'}} to={'/register'}>
                            {" "}
                            Create New Account ?
                        </Link>
                    </div>
                    <div className="line"> <span>Or</span></div>
                    <div
                        className="login-button-google"
                        onClick={MediaGoogleLogin}>
                        <GoogleOutlined /> <span className="left-margin"> Sign In With Google </span>
                    </div>
                    <br />
                    <div
                        className="login-button-facebook"
                        onClick={MediaFacebookLogin}>
                        <FacebookFilled /> <span className="left-margin"> Sign In With Facebook </span>
                    </div>
                </form>
            </div>
            )}
        </div>
    );
};

/* `export default Login;` is exporting the `Login` component as the default export of this module. */
export default Login;