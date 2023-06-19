import React from 'react';
import { toast } from 'react-toastify';

const showNotificationForOffline = () => {
  toast.error('No Internet connection !', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const showNotificationForOnline = () => {
  toast.success('Internet Connected', {
    position: 'top-left',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    role: 'signOut',
  });
};

const showNotificationForRegisterSuccess = () => {
  toast.success('Your Account created successfully ', {
    position: 'top-left',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    role: 'signOut',
  });
};

const showNotificationForRegisterError = (error) => {
  toast.error(error, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const showNotificationForLoginSuccess = () => {
  toast.success('You Have successfully Logged in', {
    position: 'top-left',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    role: 'signOut',
  });
};

const showNotificationForLoginError = (error) => {
  toast.error(error, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const showNotificationForLogoutSuccess = () => {
  toast.success('You Have successfully Logged Out', {
    position: 'top-left',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    role: 'signOut',
  });
};

const showNotificationForUpdateSuccess = () => {
  toast.success('Your Profile Updated Successfully ', {
    position: 'top-left',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    role: 'signOut',
  });
};

const showNotificationForUpdateError = (error) => {
  toast.error(error, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export {
  showNotificationForOffline,
  showNotificationForOnline,
  showNotificationForRegisterSuccess,
  showNotificationForRegisterError,
  showNotificationForLoginSuccess,
  showNotificationForLoginError,
  showNotificationForLogoutSuccess,
  showNotificationForUpdateSuccess,
  showNotificationForUpdateError,
};