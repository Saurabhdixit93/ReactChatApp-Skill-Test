import React, { useState } from 'react';

function ImageUploadModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <label htmlFor="messageImage" className="messageImage-upload" onClick={handleClick}>
        <i className="fa fa-image"></i>
      </label>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClose}>&times;</span>
            <form className="popup-form">
              {/* Modal content */}
              <input type="file" id="fileUpload" className="file-input" accept="image/*" />
              <input type="text" id="messageText" className="message-text" placeholder="Enter your message" />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploadModal;