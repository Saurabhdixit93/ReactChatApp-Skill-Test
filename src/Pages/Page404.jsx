import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 Page</h1>
      <p className="not-found-text">Oops! The page you're looking for does not exist.</p>
      <Link to={'/'} style={{textDecoration:"none"}}>
        <span className='back-button'>
            Go Back
        </span>
      </Link>
    </div>
  );
};

export default NotFound;