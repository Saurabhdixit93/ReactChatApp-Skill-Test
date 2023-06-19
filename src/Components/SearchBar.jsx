import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Loading from "../Components/Loading";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";

// Import the Firebase database object
import { db } from "../firebase";

const SearchBar = () => {
    // Define state variables for the username, user, and error
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [loading , setLoading] = useState(false);
    const { currentUser } = useAuth();


    // Define the handleSearch function to search for a user in the Firestore database
    const handleSearch = async (e) => {
        // start loading on seach click
        setLoading(true);
        // Create a Firestore query to search for the user by their display name
        const seachQuery = query(collection(db,"users"),where("displayName", "==" ,username));
        try{
           // Execute the query and get the query snapshot
           const querySnapshot = await getDocs(seachQuery);

            // Check if any documents are found in the query snapshot
            if (querySnapshot.size === 0) {
                // User not found, handle the error
                setErr(true);
                setLoading(false);
                return;
            }
           // Loop through the documents in the query snapshot and set the user state variable to the first document's data
           querySnapshot.forEach((doc) => {
               setUser(doc.data());
           });
           // stop loading
           setLoading(false);
           setErr(false);
        }catch(err){
            // Set the error state variable to true if the query fails
            setErr(true);
        }
        setUsername('');
    };

    // Define the handleKey function to handle the Enter key press event
    const handleKey = (e) => {
        // Call the handleSearch function if the Enter key is pressed
        e.code === "Enter" && handleSearch();
    };

    // Define the handleSelect function to create a chat between the current user and the selected user
    const handleSelect = async (e) => {
        e.preventDefault();
        // Create a combined ID for the chat by concatenating the UIDs of the current user and the selected user
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try{
            // check whether the group(chat's in firestore)  exists if not create
            const responseChats = await getDoc(doc(db, "chats", combinedId));

            if(!responseChats.exists()){
                // create chat collection 
                await setDoc(doc(db , "chats" ,combinedId),{ messages: []});
                
                // create currentUser chats
                await updateDoc(doc(db, "usersChatRoom" ,currentUser.uid),{

                    [combinedId + ".userInfo"]:{
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedId+".date"]: serverTimestamp()
                });

                // create user chats
                await updateDoc(doc(db, "usersChatRoom" ,user.uid),{
                    [combinedId + ".userInfo"]:{
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId+".date"]: serverTimestamp()
                });
            }

        }catch(err){
            setErr(err)
        }
        // Reset the user and username state variables
        setUser(null);
        setUsername('');
    };

    return(
        <div>
            <div className="search-bar">
                <div className="searchbar-with-icon">
                    <input 
                        type="text" 
                        placeholder="Search User"
                        required 
                        className='search-bar-input'
                        onKeyDown={handleKey}
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                    <span className="search-icon" onClick={handleSearch} style={{cursor:"pointer"}}>
                        <i className="fa fa-search"></i>
                    </span>
                </div>
                {/* Loading */}
                {loading && <Loading/>}
            </div>
            {err && <span className="not-user">User not found!</span>}
            {user && 
               <div className="userChat" onClick={handleSelect}>
                    <img src={user.photoURL} alt="friend-user" />
                    <div className="userChatInfo">
                        <span className="display-name">{user.displayName}</span>
                        <div className="icon-add">
                            <span>
                                <i className="fa fa-user-plus"></i>
                            </span>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default SearchBar;