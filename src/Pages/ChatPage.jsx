/*  imports various dependencies and components. */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import PageLoader from '../Components/PageLoader';
import SearchBar from '../Components/SearchBar';
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useChatAuth } from '../Context/ChatContext';
import {v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Message from '../Components/Messages';

  const Sidebar = () => {
  /* getting`currentUser` object from the authentication context . */
    const {currentUser} = useAuth();

    /*is using the `useChatAuth` hook to get access to the `dispatch` function. */
    const {dispatch} = useChatAuth();

    /*  It declares a state variable called "chats" using the useState hook. */
    const [chats ,setChats ] = useState([]);


    /* It is listening to changes in a document with the ID `currentUser.uid` in the
    `usersChatRoom` collection, and updating the state of the component with the data from that
    document using the `setChats` function.  */
    useEffect(() => {
      const getChats = () => {
        const unsub = onSnapshot(doc(db ,"usersChatRoom" ,currentUser.uid), (docu) =>{
            setChats(docu.data());
        });

        return () => {
            unsub()
        }
      };
      currentUser.uid && getChats();
    },[currentUser.uid]);


   /**
    * This function handles the selection of a chat user and updates the state with the selected user.
    */
    const handleSelectChat = async (user) => {
      dispatch({type:"CHANGE_USER" ,payload: user});
    };

    /* The above code is a React component that renders a sidebar with a header "Online Friends", a
    search bar component, and a list of friends/chats. */
    return (
      <div className="sidebar">
          <div className="sidebar-header">
            <h2>Online Friends</h2>
          </div>
          {/* dynamic search bar component */}
          <div><SearchBar/></div>
          <div className="responsive-with-hide-show-button">
            <div className="sidebar-content">
              { chats && Object.entries(chats)
                .sort((a,b) => a[1].date - b[1].date)
                .map(chat =>(
                <div key={chat[0]} onClick={() => handleSelectChat(chat[1].userInfo)}>
                  <div className="friend-name-message">
                    <div className="friend">
                      <img src={chat[1]?.userInfo.photoURL} className='friend-image' alt="current-user" />
                      <div className="friend-name">{chat[1]?.userInfo.displayName}</div> 
                    </div>
                    <div className="last-message">
                      <span className='message-text' style={{marginBottom:"6px"}}>
                        {chat[1]?.lastMessage?.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    );
  };
  


// chat box component

  const ChatBox = () => {
      /*  It is defining a functional
      component that is using some hooks such as `useChatAuth` and `useAuth`. It is also defining
      some state variables using the `useState` hook such as `text`, `img`, and `message`. */

      const { data } = useChatAuth();
      const {currentUser} = useAuth();
      const [text, setText] = useState("");
      const [img , setImg] = useState(null);
      const [message , setMessage] = useState([]);
      const [isOpen, setIsOpen] = useState(false);



      /**
      * The handleClick function sets the isOpen state to true.
      */
      const handleClick = () => {
        setIsOpen(true);
      };
    
      /**
      * The function handleClose sets the state of isOpen to false.
      */
      const handleClose = () => {
        setIsOpen(false);
      };


      /* The above code is a React functional component that defines a state variable called `selectedFile`
      using the `useState` hook. It also defines a function called `handleFileChange` that is triggered
      when a file is selected using an input element.*/

      const [selectedFile, setSelectedFile] = useState(null);

      const handleFileChange = (event) => {
          const file = event.target.files[0];
          setSelectedFile(file);
          setImg(event.target.files[0]);
      };


      /* useEffect hook that listens for changes to the "messages" field in a
      Firestore document with the ID specified in the "data.chatId" variable. */
    useEffect(() => {
      const messagesEffect = () => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
          if (doc.exists()){
            setMessage(doc.data().messages);
          }
        });

        return () => {
          unsub();
        };
      }
      data.chatId && messagesEffect();
    },[data.chatId]);



  // handle message send 
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
      try {
      setLoading(true); // Set loading state to true

      if(text.length === 0){
        setLoading(false);
        return;
      }
  
      if (img) {
        const storageRef = ref(storage, "userchatsimage/"+uuid());
        
        const uploadTask = uploadBytesResumable(storageRef, img);
        
        const uploadSnapshot = await uploadTask;
  
        const downloadURL = await getDownloadURL(uploadSnapshot.ref);
  
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: text,
            senderId: currentUser.uid,
            img: downloadURL,
            date: Timestamp.now(),
          }),
        });
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }
      await updateDoc(doc(db, "usersChatRoom", currentUser.uid), {
        [data.chatId + ".lastMessage"]: {
          text: text,
        },
        [data.chatId + ".lastDate"]: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "usersChatRoom", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text: text,
        },
        [data.chatId + ".lastDate"]: serverTimestamp(),
      });
  
      setText("");
      setImg(null);
      setIsOpen(false);
      setLoading(false); // Set loading state to false after the operation is complete
      return;
    } catch (error) {
        console.log("Error In Image Upload", error);
        setText("");
        setImg(null);
        setLoading(false); // Set loading state to false if an error occurs
        return;
      }
    };

    const handleKey = (e) => {
      // Call the handleSendMessage function if the Enter key is pressed
      e.code === "Enter" && handleSendMessage();
    }
    return (
        <div className="chat-box">
            <div className="chat-box-header">
                <div className="active-user-profile">
                    <img src={data.user?.photoURL} className='active-user-profile' alt="" />
                </div>
            
                <div className='active-username'>
                    <h3 className='active-user'>{data.user?.displayName}</h3>
                </div>
            </div>
            <div className="chat-user">
                <div className="chat-user-all-content">
                    
                    {/* all messages */}

                    {message.map(allMessage => (
                        <Message message={allMessage} key={allMessage.id} />
                    ))}
            
                    <div className="inputContainer-box">
                        <div className="input-container">
                            <input 
                              type="text"   
                              name='messge' 
                              placeholder="Type your message" 
                              required 
                              className='chat-input' 
                              onChange={(e)=> setText(e.target.value)}
                              value={text}
                              onKeyDown={handleKey}
                            />
                          <div>
                            {isOpen && (
                              <div className="modal_new">
                                <div className="modal_content">
                                  <span className="close" onClick={handleClose}>&times;</span>
                                  <div className="popup-form">
                                    {/* Modal content */}
                                    <div className="image_with_image_name">
                                    <input 
                                      type="file" 
                                      name="messageImage" 
                                      id="messageImage2" 
                                      style={{display:'none'}}
                                      accept="image/*"
                                      onChange={handleFileChange}
                                    />
                                      <label htmlFor="messageImage2" className="file-upload">
                                        <i className="fa fa-image"></i>
                                        <div>
                                          <span style={{marginLeft:"5px"}}> Select File <span style={{color:"red"}}>*</span></span>
                                        </div>
                                      </label>
                                      <div className="image_name">
                                        {selectedFile && (
                                        <div className="fileName_selected" id="file-name">
                                            {selectedFile.name}
                                        </div>
                                        )}
                                      </div>
                                    </div>
                                    <input 
                                        type="text"   
                                        name='messge' 
                                        placeholder="Type your message" 
                                        required 
                                        className='chat-input' 
                                        onChange={(e)=> setText(e.target.value)}
                                        value={text}
                                        onKeyDown={handleKey}
                                    />
                                    <button type="submit" className="sendbutton" onClick={handleSendMessage}>{loading ?<i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-paper-plane"></i>}</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                            <label  className="messageImage-upload" onClick={handleClick}>
                              <i className="fa fa-image"></i>
                            </label>
                          <button type='submit' className='sendIcon-button' onClick={handleSendMessage}> {loading ?<i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-paper-plane"></i>} </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };


  // chat page component
    const Chat = () => {
      const [isLoading, setisLoading] = useState(true);
      useEffect(() => {
        const timer = setTimeout(() => {
          setisLoading(false);
        } ,2000);
  
        return () => clearTimeout(timer);
      }, []);
    
    return (
      <div>
        {isLoading ? (
            <div className="loader-view" > <PageLoader/> </div>
        ): (
            <div className="chat-container">
              <Sidebar />
              <ChatBox />
            </div>
        )}
      </div>
    );
  };

// exporting chat for all uses
export default Chat