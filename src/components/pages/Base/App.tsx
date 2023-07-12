import '../../../styles/App.scss';
import { Routes, Route, useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import { useState, createContext, useRef, useEffect, RefObject } from 'react';
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import Dashboard from '../Dashboard/dashboard';
import Navbar from './navbar';
import Menu from "../Menu/menu";
import Inventory from '../Inventory/inventory';
import Orders from '../Orders/orders';
import Footer from './footer';
import ArchivedOrders from '../Orders/ordersArchive';
import Home from '../Home/home';
import Register from '../User/register';
import Login from '../User/login2';
import Logout from '../User/logout';
import PrivateRoute from '../../modules/privateRoute';
import endpoints from '../../../data/endpoints';
import Profile from '../User/profile';
import { Unauthorised, Forbidden, NotFound, InternalError } from './errors';
// import { checkTokens } from '../../../utils/baseUtils';

// Define constants
export const CONTROLLER = new AbortController();

// Create Contexts
export const ThemeContext = createContext<string>('light-mode');

// Define public pages
export const PUBLIC = ["/menu", "/login", "/register", "/"];

// Create axios user and restaurant instances
const HEADERS = {    
    "Content-Type": 'multipart/form-data',
    "Authorization": `Bearer ${sessionStorage.getItem("access")}`
};

const FORMSERIALIZER = { metaTokens: false, indexes: null };

export const userAPI = axios.create({
    baseURL: `${endpoints["prefix_user"]}`,
    timeout: 20000,
    formSerializer: FORMSERIALIZER,
    signal: CONTROLLER.signal
});


export const dataAPI = axios.create({
    headers: HEADERS,
    baseURL: `${endpoints["prefix"]}`,
    timeout: 20000,
    formSerializer: FORMSERIALIZER,
    signal: CONTROLLER.signal
});


function checkTokens(navigate: RefObject<NavigateFunction>) {
    const expiry = new Date(sessionStorage.getItem("expiry") ?? "");

    if (new Date() > expiry) {
        // Try refreshing token if access token expired
        userAPI.post(`${endpoints["prefix_user"]}${endpoints["refesh"]}`, {})
        .then((response: AxiosResponse) => sessionStorage.setItem("access", response.data.access))
        .catch(() => navigate.current!("/logout"));
    }
};


function App() {
    
    // Set app states
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");
    const navigate = useRef(useNavigate());
    const location = useRef(useLocation());
    
    // Set user states
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true" ? true : false);
    const [isStaff, setIsStaff] = useState(sessionStorage.getItem("isStaff") === "true" ? true : false);
    const [role, setRole] = useState(sessionStorage.getItem("role"));



    // Create interceptors on first load
    useEffect(() => {

        console.log("in app");
        // Set access token
        userAPI.defaults.headers.common["Authorization"] = `Bearer ${ sessionStorage.getItem("access") }`;
        dataAPI.defaults.headers.common["Authorization"] = `Bearer ${ sessionStorage.getItem("access") }`;

        // Create request interceptor to check if tokensare valid
        axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            checkTokens(navigate);
            return config
        }, 
        (error: AxiosError) => {
            navigate.current("/logout");
            Promise.reject(error)
        });

        // Create repsonse interceptor to redirect when certain errors appear
        dataAPI.interceptors.response.use((response: AxiosResponse) => {
            return response
        }, (error: AxiosError) => {
            
            switch (error.response?.status) {
                case 401:
                    navigate.current("/unauthorised");
                    break;
                case 403:
                    navigate.current("/forbidden");
                    break;
                case 404:
                    navigate.current("/not-found");
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
