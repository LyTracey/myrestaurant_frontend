import '../../styles/App.scss';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, createContext, useRef, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import Dashboard from '../Dashboard/dashboard';
import Navbar from '../Base/navbar';
import Menu from "../Menu/menu";
import Inventory from '../Inventory/inventory';
import Orders from '../Orders/orders';
import Footer from '../Base/footer';
import ArchivedOrders from '../Orders/ordersArchive';
import Home from '../Home/home';
import Register from '../User/register';
import Login from '../User/login';
import Logout from '../User/logout';
import PrivateRoute from './privateRoute';
import endpoints from '../../data/endpoints';
import Profile from '../User/profile';
import { Unauthorised, Forbidden, NotFound, InternalError } from '../Errors/errors';
import { checkTokens } from './baseUtils';

// Define constants
// Create Contexts
export const ThemeContext = createContext<string>('light-mode');

// Define public pages
export const PUBLIC = ["/menu", "/login", "/register", "/"];

// Create axios user and restaurant instances
export const HEADERS = {    
    "Content-Type": 'multipart/form-data',
    "Authorization": `Bearer ${sessionStorage.getItem("access")}`
};

const FORMSERIALIZER = { metaTokens: false, indexes: null };

export const userAPI = axios.create({
    baseURL: `${endpoints["prefix_user"]}`,
    timeout: 1000,
    formSerializer: FORMSERIALIZER
});


export const dataAPI = axios.create({
    headers: HEADERS,
    baseURL: `${endpoints["prefix"]}`,
    timeout: 1000,
    formSerializer: FORMSERIALIZER
});


function App() {

    // Set states
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true" ? true : false);
    const [isStaff, setIsStaff] = useState(sessionStorage.getItem("isStaff") === "true" ? true : false);
    const [role, setRole] = useState(sessionStorage.getItem("role"));
    const navigationRef = useRef(useNavigate());
    const location = useRef(useLocation());
    

    useEffect(() => {
        // Create request interceptor to check if tokens are valid
        dataAPI.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
            await checkTokens(navigationRef, setLoggedIn, location);
            return config
        }, (error: AxiosError) => {
            return Promise.reject(error);
        });
    
        // Create repsonse interceptor to redirect when certain errors appear
        dataAPI.interceptors.response.use(async (response: AxiosResponse) => {
            return response
        }, (error: AxiosError) => {
            
            switch (error.response?.status) {
                case 401:
                    navigationRef.current("/unauthorised");
                    break;
                case 403:
                    navigationRef.current("/forbidden");
                    break;
                case 404:
                    navigationRef.current("/not-found");
                    break;
                default:
                    console.log(error);
            }   
        } );
    }, []);

    
    
    return (
        <div className={`App ${ theme }`}>
            <ThemeContext.Provider value={theme}>
                <Navbar theme={ theme } setTheme={ setTheme } loggedIn={ loggedIn } isStaff={ isStaff } role={ role } location={ location }/>
                    <Routes>
                        <Route index element={ <Home /> } />
                        <Route path="/menu" element={ <Menu isStaff={ isStaff } role={ role }/> } /> 
                        <Route path="/login" element={ <Login setLoggedIn={ setLoggedIn } setIsStaff={ setIsStaff } setRole={ setRole }/>} />
                        <Route path="/logout" element={ <Logout setLoggedIn={ setLoggedIn } setIsStaff={ setIsStaff } />} />
                        <Route path="/register" element={ <Register /> } />
                        <Route path="/unauthorised" element={ <Unauthorised /> } />
                        <Route path="/forbidden" element={ <Forbidden /> } />
                        <Route path="/not-found" element={ <NotFound /> } />
                        <Route path="/internal-error" element={ <InternalError /> } />
                        
                        {/* Create privateroute to redirect to login if user is not logged in when accessing non-public pages */}
                        <Route path="/" element={ <PrivateRoute loggedIn={ loggedIn }/>}>
                            <Route path="/profile" element={ <Profile setIsStaff={ setIsStaff } setRole={ setRole } />} />
                            <Route path="/dashboard" element={ <Dashboard /> } />
                            <Route path="/inventory" element={ <Inventory /> } />
                            <Route path="/orders" element={ <Orders />} />
                            <Route path="/orders/archive" element={ <ArchivedOrders /> } />
                        </Route>
                    </Routes>
                <Footer />
            </ThemeContext.Provider>
        </div>
    )
}

export default App;
