import React, { useEffect, useRef, useState } from "react";
import { useChatAuth } from "../Context/ChatContext";
import { useAuth } from "../Context/AuthContext";
import AvatarImage from "./ImageAvtar";

const Message = ({message}) => {
    const { data } = useChatAuth();
    const {currentUser} = useAuth();
    const ref = useRef();
    const [isImageLoading , setIsImageLoading] = useState(true);

    const handleImageLoading = () => {
        setIsImageLoading(false);
    }

    useEffect(() => {
        ref.current?.scrollIntoView({behavior:"smooth"});
    },[message]);

    return(

    <div className={`user-messages ${message.senderId === currentUser.uid && "owner"}`} ref={ref}>
        <div className="senderdiv" >
            <div className="sender-message">
                <span className="sender-message-text">
                    <p style={{marginBottom:"2px"}}> {message.text}</p>
                </span>
               <AvatarImage 
                  imageUrl={message.senderId === currentUser.uid ? currentUser.photoURL:data.user.photoURL}
               />
            </div>
            
            <div className="image-content">
                {message.img && (
                    <img className="image-content-sender" src={message.img} alt="" />
                )}
            </div>
            <div className="just-now">
                <span className="just-now-text"> just now</span>
            </div>
        </div>
    </div>
    )
};

export default Message;