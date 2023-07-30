import "../styles/App.scss";
import { Route, useNavigate, NavigateFunction, createBrowserRouter, createRoutesFromElements, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { useState, createContext, useRef, useEffect, RefObject, useMemo } from 'react';
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import Dashboard from './pages/dashboard';
import Navigation from './modules/navbar';
import Menu from "./pages/Menu/menu";
import Inventory from './pages/Inventory/inventory';
import Orders from './pages/Orders/orders';
import Footer from './modules/footer';
import ArchivedOrders from './pages/Orders/ordersArchive';
import Home from './pages/home';
import Register from './pages/User/register';
import Login from './pages/User/login';
import Logout from './pages/User/logout';
import PrivateRoute from './modules/privateRoute';
import { externalEndpoints } from '../data/endpoints';
import Profile from './pages/User/profile';
import { Unauthorised, Forbidden, NotFound, InternalError } from './modules/errors';
import { errorFormatter } from '../utils/formatUtils';
import { InventoryCreateForm } from './pages/Inventory/inventoryCreate';

// Constants
export const CONTROLLER = new AbortController();
export const PUBLIC_PAGES = ["/menu", "/login", "/register", "/"];

// Interfaces
export interface User {
    username: string | null,
    isStaff: boolean | null,
    joinDate: string| null,
    role: string | null
}

// Create global context
export const GlobalContext = createContext<any>({});

// Create axios user and restaurant instances
const HEADERS = {    
    "Content-Type": 'multipart/form-data',
    "Authorization": `${sessionStorage.getItem("access") ?? ""}`
};
const FORMSERIALIZER = { metaTokens: false, indexes: null };

export const userAPI = axios.create({
    baseURL: `${ externalEndpoints["prefix_user"]}`,
    timeout: 20000,
    formSerializer: FORMSERIALIZER,
    signal: CONTROLLER.signal,
    headers: HEADERS
});

export const dataAPI = axios.create({
    headers: HEADERS,
    baseURL: `${externalEndpoints["prefix"]}`,
    timeout: 20000,
    formSerializer: FORMSERIALIZER,
    signal: CONTROLLER.signal,
});

// Function to check if token is valid
function checkTokens(navigate: RefObject<NavigateFunction>) {
    const expiry = new Date(sessionStorage.getItem("expiry") ?? "");

    if (new Date() > expiry) {
        // Try refreshing token if access token expired
        userAPI.post(`${externalEndpoints["prefix_user"]}${externalEndpoints["refesh"]}`, {})
        .then((response: AxiosResponse) => sessionStorage.setItem("access", response.data.access))
        .catch(() => navigate.current!("/logout"));
    }
};

// Create Layout
function AppLayout () {

    // Set global app states
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") ?? "light-mode");
    const navigate = useRef(useNavigate());
    const [feedback, setFeedback] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>();
    const { pathname } = useLocation();

    
    // Set user state
    const [user, setUser] = useState<User>({
        username: sessionStorage.getItem("username"),
        isStaff: sessionStorage.getItem("isStaff") === "true",
        joinDate: null,
        role: null
    });
    const [loggedIn, setLoggedIn] = useState<boolean>(!!sessionStorage.getItem("loggedIn"));


    // Create interceptors on first load
    useEffect(() => {

        // Create request interceptor to check if tokens are valid
        axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            setLoading(true);
            checkTokens(navigate);
            return config
        }, 
        (error: AxiosError) => {
            navigate.current("/logout");
            Promise.reject(error)
        });

        // Create repsonse interceptor to redirect when certain errors appear
        dataAPI.interceptors.response.use((response: AxiosResponse) => {
            setLoading(false);
            return response
        }, (error: AxiosError) => {
            setLoading(false);
            setFeedback(errorFormatter(error));
            console.log(error);
            if (error.response?.status === 401) {
                navigate.current("/login");                  
            }   
        } );
    }, []);

    useEffect(() => setFeedback([]), [pathname]);


    const globalContext = useMemo(() => {
        return {
            theme: [theme, setTheme], 
            loggedIn: [loggedIn, setLoggedIn],
            user: [user, setUser],
            navigate: navigate,
            feedback: [feedback, setFeedback],
            loading: [loading, setLoading]
        }
    }, [theme, loggedIn, user, feedback, loading]);

    return (
        <GlobalContext.Provider value={ globalContext }>
            <Navigation />
            <Outlet />
            <Footer />
        </GlobalContext.Provider>
    )
};

// Create router
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={ <AppLayout /> } >
            <Route index element={ <Home /> } />
                <Route path="/menu" element={ <Menu /> } /> 
                <Route path="/login" element={ <Login />} />
                <Route path="/logout" element={ <Logout />} />
                <Route path="/register" element={ <Register /> } />
                <Route path="/unauthorised" element={ <Unauthorised /> } />
                <Route path="/forbidden" element={ <Forbidden /> } />
                <Route path="/not-found" element={ <NotFound /> } />
                <Route path="/internal-error" element={ <InternalError /> } />
                
                {/* Create privateroute to redirect to login if user is not logged in when accessing non-public pages */}
                <Route path="/" element={ <PrivateRoute />}>
                    <Route path="/profile" element={ <Profile />} />
                    <Route path="/dashboard" element={ <Dashboard /> } />
                    <Route path="/inventory" element={ <Inventory /> }>
                        <Route path="/inventory/create" element={ <InventoryCreateForm /> } />
                        {/* <Route path="/inventory/update/:id" element={ <Inventory /> } /> */}
                    </Route>
                    <Route path="/orders" element={ <Orders />}>
                        <Route path="/orders/archive" element={ <ArchivedOrders /> } />
                    </Route>
            </Route>
        </Route>
    )
);

// Create App
function App() {

    return (
        <div className={`App ${ localStorage.getItem("theme") }`}>
            <RouterProvider router={ router }/>
        </div>
    )
}

export default App;
