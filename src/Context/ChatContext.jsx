import {createContext , useContext ,useReducer} from "react";
import { useAuth } from "./AuthContext";

export const ChatAuthContext = createContext();

export const ChatAuthContextProvider = ({ children }) => {
    const {currentUser} = useAuth();
    const INITIAL_STATE = {
        chatId: "null",
        user:{},
    };

    const chatReducer = (state ,action) => {
        switch (action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId: 
                    currentUser.uid > action.payload.uid 
                    ? currentUser.uid + action.payload.uid 
                    : action.payload.uid + currentUser.uid,
                }
            default:
                return state;   
        }
    };

    const [state ,dispatch] = useReducer(chatReducer ,INITIAL_STATE);


    return (
        <ChatAuthContext.Provider value={{ data:state , dispatch }}>
            {children}
        </ChatAuthContext.Provider>
    );
};

export const useChatAuth = () => {
    return useContext(ChatAuthContext);
};