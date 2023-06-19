import React from "react";

function PopupModal({message}){
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
            </div>
        </div>
    );
};

export default PopupModal;