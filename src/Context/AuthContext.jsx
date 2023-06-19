// Import the onAuthStateChanged function from the Firebase auth module and the createContext, useState, and useEffect hooks from React
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";

// Import the Firebase auth object
import { auth } from "../firebase";

// Create a new context object called AuthContext
export const AuthContext = createContext();

// Define the AuthContextProvider functional component
export const AuthContextProvider = ({ children }) => {
  // Define a state variable called currentUser and initialize it to an empty object
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading , setisLoading] = useState(true);


  // Use the useEffect hook to listen for changes in the user's authentication state
  useEffect(() => {
    // Call the onAuthStateChanged function with the auth object and a callback function that sets the currentUser state variable to the user object and logs the user object to the console
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setisLoading(false);
    });

    // Return a cleanup function that unsubscribes from the onAuthStateChanged listener
    return unsub();
  }, []);

  // Return the JSX for the AuthContextProvider component, which includes the AuthContext.Provider component and its children
  return (
    <AuthContext.Provider value={{ currentUser }}>
      { !isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    return useContext(AuthContext);
};


