import React, { useEffect, useState } from "react";
import {useAuth } from "../Context/AuthContext";
import {ref, uploadBytesResumable , getDownloadURL, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PageLoader from "../Components/PageLoader";
import { showNotificationForUpdateError ,showNotificationForUpdateSuccess } from "../Components/Notifications";
import { doc, setDoc } from "firebase/firestore";


const UpdateUserDetails = () => {
    const navigate = useNavigate();
    const [data , setData] = useState({
        newName: "",
        newEmail:"",
        oldPassword: "",
    });

    const [image , setImage] = useState(null);
    const [loading , setLoading] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const {currentUser} = useAuth();
    const handleChange = (e) => {
        setData((prev) =>({ ...prev , [e.target.name]: e.target.value}));
    }
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setImage(event.target.files[0]);
    };

    // this handle update details
    const handleUpdateSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
    
        if(image){
            try{
                const newDisplayName = data.newName;
                const updateNewEmail = data.newEmail;
                const oldPassword = data.oldPassword;
    
                const storageRef = ref(storage,newDisplayName);
                let storageRefExists = await checkIfStorageRefExists(storageRef);
    
                if (!storageRefExists) {
                    await uploadImageToStorage(storageRef, image);
                }
    
                await updateProfileWithImage(storageRef, image, newDisplayName, oldPassword, updateNewEmail);
            }catch(error){
                handleUpdateError(error);
                return;
            }
        }
    };
    
    const checkIfStorageRefExists = async (storageRef) => {
        try {
            await getMetadata(storageRef);
            return true;
        } catch (error) {
            return false;
        }
    };
    
    const uploadImageToStorage = async (storageRef, image) => {
        try {
            const fileRef = await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(fileRef.ref);
        } catch (error) {
            throw error;
        }
    };
    
    // const updateProfileWithImage = async (storageRef, image, newDisplayName, oldPassword, updateNewEmail) => {
    //     const uploadTask = uploadBytesResumable(storageRef, image);
    //     uploadTask.on(
    //         (error) => {
    //             if(error){
    //                 showNotificationForUpdateError(error.message);
    //                 return;
    //             }
    //         }, 
    //         async () => {
    //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //             await updateProfile(currentUser, {
    //                 photoURL: downloadURL,
    //                 displayName: newDisplayName,
    //             });
    //             const credentialProvider = EmailAuthProvider.credential(currentUser.email, oldPassword);
    //             await reauthenticateAndEmailUpdate(currentUser, credentialProvider, updateNewEmail);
    //         }
    //     );
    // };
    
    // const updateProfileWithImage = async (storageRef, image, newDisplayName, oldPassword, updateNewEmail) => {
    //     const uploadTask = uploadBytesResumable(storageRef, image);
    //     uploadTask.on(
    //         (error) => {
    //             if(error){
    //                 showNotificationForUpdateError(error.message);
    //                 return;
    //             }
    //         }, 
    //         async () => {
    //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //             await updateProfile(currentUser, {
    //                 photoURL: downloadURL,
    //                 displayName: newDisplayName,
    //             });
    //             const credentialProvider = EmailAuthProvider.credential(currentUser.email, oldPassword);
    //             await reauthenticateAndEmailUpdate(currentUser, credentialProvider, updateNewEmail);
    
    //             // Add the function call here
    //             await createUpdatedUserDataInFirestore(currentUser, newDisplayName, updateNewEmail, downloadURL);
    //         }
    //     );
    // };


    const updateProfileWithImage = async (storageRef, image, newDisplayName, oldPassword, updateNewEmail) => {
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            (error) => {
                if(error){
                    showNotificationForUpdateError(error.message);
                    return;
                }
            }, 
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const credentialProvider = EmailAuthProvider.credential(currentUser.email, oldPassword);
                try {
                    await reauthenticateAndEmailUpdate(currentUser, credentialProvider, updateNewEmail);
                    await updateProfile(currentUser, {
                        photoURL: downloadURL,
                        displayName: newDisplayName,
                    });
                    await createUpdatedUserDataInFirestore(currentUser, newDisplayName, updateNewEmail, downloadURL);
                } catch (error) {
                    handleUpdateError(error);
                    return;
                }
            }
        );
    };
    
    const reauthenticateAndEmailUpdate = async (currentUser, credentialProvider, updateNewEmail) => {
        try{
            await reauthenticateWithCredential(currentUser, credentialProvider);
            if (updateNewEmail !== currentUser.email) {
                await updateEmail(currentUser, updateNewEmail);
                showNotificationForUpdateSuccess();
                setLoading(false);
                navigate('/');
                window.location.reload();
            }
        }catch(error){
            handleUpdateError(error);
            return;
        }
    };
    
    const handleUpdateError = (error) => {
        showNotificationForUpdateError(error.message);
        setLoading(false);
        setTimeout(() => {
            setLoading(false);
        },4000);
    };

    // create user account
  const createUpdatedUserDataInFirestore = async (currentUser, newDisplayName, updateNewEmail, downloadURL) => {
    const uid = currentUser.uid;
    await setDoc(doc(db, 'users', uid), {
      uid:uid,
      displayName:newDisplayName,
      email:updateNewEmail,
      photoURL: downloadURL,
    });
    await setDoc(doc(db, 'usersChatRoom', uid), {});
  };


    useEffect(() => {
      const timer = setTimeout(() => {
        setisLoading(false);
      } ,2000);

      return () => clearTimeout(timer);
    }, []);

    return (
    <div>
        {isLoading ? (<div className="loader-view" > <PageLoader/> </div>
        ):(
        <div  className="Update-User-details">
            <div className="update-user-card">
                <div className="update-user-head">
                    <h2 className="title"> Update Your Details</h2>
                </div>
                <form onSubmit={handleUpdateSubmit} className="update-details-form">
                    <input 
                        type="text"
                        onChange={handleChange}
                        required
                        name="newName"
                        className="input-name"
                        placeholder={currentUser.displayName}
                    /> 

                    <input 
                        type="email"
                        onChange={handleChange}
                        required
                        name="newEmail"
                        className="input-email"
                        placeholder={currentUser.email}
                    />
               
                    <span className="note"> Enter Correct Password To Update Email *</span>
                    <input 
                        type="password"
                        onChange={handleChange}
                        required
                        name="oldPassword"
                        className="input-email"
                        placeholder="Enter your old password..."
                    />
                        
                    <div className="file-input-container">

                        <label htmlFor="file-input" className="file-input-label">
                            Select File *
                        </label>

                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input" 
                            name="profileImage"
                        />

                        {selectedFile && (
                        <div className="selected-file file-name" id="file-name">
                            {selectedFile.name}
                        </div>
                        )}

                    </div>
                    <button type="submit" className="update-button">{loading ? <div className="loadingregister"> <span className="focus"> Updating Your Account.. </span><i className="fa fa-spinner fa-spin"></i> </div> : "Update"}</button>
                </form>
            </div>
        </div>
        )}
    </div>
    );
};

export default UpdateUserDetails;