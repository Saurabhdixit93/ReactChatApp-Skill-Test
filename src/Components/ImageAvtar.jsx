import React, { useState } from 'react';

function AvatarImage({ imageUrl }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="sender-user-avatar">
      {isLoading && <div className="loaderImage"></div>}
      <img
        src={imageUrl}
        className={`sender-user-pic ${isLoading ? 'hidden' : ''}`}
        alt=""
        onLoad={handleImageLoad}
      />
    </div>
  );
}

export default AvatarImage;