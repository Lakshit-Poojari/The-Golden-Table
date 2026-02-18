import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerAuthContext = createContext(null);

const CustomerAuthProvider = ({children}) => {

    const navigate = useNavigate();

    const [accessToken, setaccessToken] = useState(localStorage.getItem("access_token"))

    const isAuthenticated  = !!accessToken;

    const login = (token) =>{
        localStorage.setItem("access_token", token);
        setaccessToken(token)
        navigate('/customer/book-table')
    }

    const logout = () =>{
        localStorage.removeItem("access_token");
        setaccessToken(null)
        navigate('/login')
    }

    return (
        <CustomerAuthContext.Provider value = {{accessToken, isAuthenticated , login, logout}}>{children}</CustomerAuthContext.Provider>
    )
}

const useCustomerAuth = () => {
    return useContext(CustomerAuthContext)
}

export {CustomerAuthContext, CustomerAuthProvider, useCustomerAuth}