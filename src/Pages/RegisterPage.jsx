/* This is importing various modules and components required for the Register component. */
import React, { useEffect, useState } from "react";
import FormInput from "../Components/FormInput";
import { GoogleOutlined, FacebookFilled } from "@ant-design/icons"
import "firebase/auth"
import { Link, useNavigate } from "react-router-dom";
import {auth ,db, storage} from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import PageLoader from "../Components/PageLoader";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes

} from "firebase/storage";
import PopupModal from "../Components/PopupModal";
import { showNotificationForRegisterError, showNotificationForRegisterSuccess } from "../Components/Notifications";
/* This code defines a functional component called `Register` which renders a form for user
registration. */
const Register = () => {
    const [loading , setLoading] = useState(false);
    const [isLoading, setisLoading] = useState(true); 
    const [image , setImage] = useState(null);
  
    const navigate = useNavigate();

    useEffect(() => {
      const timer = setTimeout(() => {
        setisLoading(false);
      } ,2000);

      return () => clearTimeout(timer);
    }, []);

    const [inputValues , setInputValues] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // image selected show

    const [selectedImage, setSelectedImage] = useState('');

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      setImage(file);
      reader.onload = () => {
        setSelectedImage(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        setSelectedImage('');
      }
    };
   
    const Inputs = [
        {
            id: 1,
            name: "name",
            type: "text",
            placeholder: "Enter Your Name..",
            errorMessage: "Name Should Be 3-16 digits Only And Should not include any Special Character",
            pattern: `^[A-z a-z]{3,16}$`,
            required: true,
        },
          {
            id: 2,
            name: "email",
            type: "text",
            placeholder: "Enter Your Email..",
            errorMessage: "it should be valid email address",
            required: true,
        },
          {
            id: 3,
            name: "password",
            type: "password",
            placeholder: "Enter Your Password..",
            errorMessage: "Password should be 8-20 digits and include at least 1 number, 1 letter, 1 special character",
            pattern:`(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{8,20}$`,
            required: true,
        },
          {
            id: 4,
            name: "confirmPassword",
            type: "password",
            placeholder: "Enter Your Confirm Password..",
            errorMessage:`Password not match`,
            pattern: inputValues.password,
            required: true,
        },   
    ];

   /**
    * The function updates the input values in a form when there is a change in any of the input
    * fields.
    */
    const handleFormChange = (e) => {
        setInputValues({...inputValues , [e.target.name]: e.target.value})
    };
    
    /**
     * This function handles user registration using Firebase authentication and updates the user's
     * display name.
     */

  const handleFormSubmittion = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!image) {
      // Handle the case where no image is provided
      return;
    }
  
    const { name: displayName, email, password } = inputValues;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
  
      let storageRefExists = await doesStorageRefExist(storageRef);
  
      if (!storageRefExists) {
        await uploadImageToStorage(storageRef, image);
      }
  
      const downloadURL = await uploadImageAndGetURL(storageRef, image);
  
      await updateProfile(userCredential.user, {
        displayName,
        photoURL: downloadURL,
        password,
      });
  
      await createUserDataInFirestore(userCredential, displayName, email, downloadURL);
  
      showNotificationForRegisterSuccess();
      navigate('/');
      window.location.reload();
    } catch (error) {
      setLoading(false);
      showNotificationForRegisterError(error.message);
      navigate('/');
      window.location.reload();
    }
  };
  
  // check storage function
  const doesStorageRefExist = async (storageRef) => {
    try {
      await getMetadata(storageRef);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // upload image function
  const uploadImageToStorage = async (storageRef, image) => {
    try {
      const fileRef = await uploadBytes(storageRef, image);
      return getDownloadURL(fileRef.ref);
    } catch (error) {
      throw new Error('Failed to upload image to storage');
    }
  };
  
  // get image url
  const uploadImageAndGetURL = async (storageRef, image) => {
    const uploadTask = uploadBytesResumable(storageRef, image);
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', null, reject, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      });
    });
  };
  
  // create user account
  const createUserDataInFirestore = async (userCredential, displayName, email, downloadURL) => {
    const uid = userCredential.user.uid;
    await setDoc(doc(db, 'users', uid), {
      uid,
      displayName,
      email,
      photoURL: downloadURL,
    });
    await setDoc(doc(db, 'usersChatRoom', uid), {});
  };
  
  
  // const MediaGoogleLogin = async (e) => {
  //   e.preventDefault();
  //   try{

  //     // const authM = auth();
  //     const provider = new GoogleAuthProvider();
  //     const userData = await signInWithPopup(auth, provider);

  //     showNotificationForRegisterSuccess();
  //     // Navigate to the home page
  //     navigate('/');
  //     window.location.reload();

  //   }catch(error){
  //     if(error){
  //       showNotificationForRegisterError(error.message);
  //       setisLoading(true);
  //       setTimeout(() => {
  //           setisLoading(false);
  //       },4000);
  //     };
  //   }
  // };


  // Facebook login
  
  const MediaGoogleLogin = async (e) => {
    e.preventDefault();
    try{
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = userCredential.user;
      await createUserDataInFirestoreWIthGoogle(userCredential, displayName, email, photoURL);
      showNotificationForRegisterSuccess();
      navigate('/');
      window.location.reload();
    }catch(error){
      if(error){
        showNotificationForRegisterError(error.message);
        setisLoading(true);
        setTimeout(() => {
            setisLoading(false);
        },4000);
      };
    }
  };
  
  // create users in firestore for uses
  const createUserDataInFirestoreWIthGoogle = async (userCredential, displayName, email, photoURL) => {
    const uid = userCredential.user.uid;
    await setDoc(doc(db, 'users', uid), {
      uid: uid,
      displayName : displayName,
      email: email,
      photoURL: photoURL,
    });
    await setDoc(doc(db, 'usersChatRoom', uid), {});
  }; 
  

  // facebook media login
  
  const MediaFacebookLogin = async (e) => {

    e.preventDefault();
    try{

      const provider = new FacebookAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = userCredential.user;
      await createUserDataInFirestoreWIthFacebook(userCredential, displayName, email, photoURL);
      showNotificationForRegisterSuccess();
      // Navigate to the home page
      navigate('/');
      window.location.reload();

    }catch(error){
      if(error){
        showNotificationForRegisterError(error.message);
        setisLoading(true);
        setTimeout(() => {
            setisLoading(false);
        },4000);
      };
    }
  };

    // create users in firestore for uses with fb login
    const createUserDataInFirestoreWIthFacebook = async (userCredential, displayName, email, photoURL) => {
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        uid: uid,
        displayName : displayName,
        email: email,
        photoURL: photoURL,
      });
      await setDoc(doc(db, 'usersChatRoom', uid), {});
    };


  /* returning a JSX element which renders a form for user registration. */
  return (
    <div>
      {isLoading ? (
        <div className="loader-view" > <PageLoader/> </div>
      ):(

        <div className="Register-page">
        <form className="register-form" onSubmit={handleFormSubmittion}>

          <div style={{textAlign:"center"}}>
            <h2>Register Page</h2>
          </div>

          {Inputs.map((input)=> (
            <FormInput 
              key={input.id} 
              {...input} 
              value={inputValues[input.name]} 
              onChange ={handleFormChange} 
            />
          ))}
          <div className="file-image-upload-card" style={{marginTop:5}}>
            <input 
              type="file"
              id="file"
              style={{display:"none"}}
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <label 
              htmlFor="file" 
              className='messageImage-upload' style={{marginLeft:2}}>
              <i 
                className="fa fa-image">
              </i>
            </label>
            <span className="add-avtar-text"> Add an Avtar <span style={{color:"red"}}> *</span> </span>
            <div className="selected-image">
              {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="selected-image-live" />
              ) :null}
            </div>
          </div>
          <button type="submit" className="register-button">{loading ? <div className="loadingregister"> <span className="focus"> Creating Account.. </span><i className="fa fa-spinner fa-spin"></i> </div> : "Register"}</button>
          <br />
          <div className="Path-Login">
            <Link style={{textDecoration:'none'}} to={'/login'}>
              {" "}
              Already have an account?
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

/*  exporting the `Register` component as the default export of this module */
export default Register;