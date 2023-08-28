import "../../styles/App.scss";
import { Route, createBrowserRouter, createRoutesFromElements, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import { useState, createContext, useEffect, useContext } from 'react';
import Dashboard from './dashboard';
import Navigation from '../modules/navbar';
import Menu from "./Menu/menu";
import Inventory from './Inventory/inventory';
import Orders from './Orders/orders';
import Footer from '../modules/footer';
import ArchivedOrders from './Orders/ordersArchive';
import Home from './home';
import Register from './User/register';
import Login from './User/login';
import Logout from './User/logout';
import PrivateRoute from '../modules/privateRoute';
import { internalEndpoints, externalEndpoints } from '../../data/endpoints';
import Profile from './User/profile';
import { InventoryCreateForm, InventoryUpdateForm } from './Inventory/inventoryForms';
import { InventoryLoader, MenuLoader, OrdersLoader, OrdersArchiveLoader, UserLoader } from "../modules/loaders";
import { MenuCreateForm, MenuUpdateForm } from "./Menu/menuForms";
import { OrderCreateForm, OrderUpdateForm } from "./Orders/ordersForm";
import RootErrorBoundary from "../modules/errors";
import axios, {AxiosResponse, InternalAxiosRequestConfig, AxiosError} from "axios";
import { changeTokens } from "../../utils/apiUtils";
import jwt_decode from "jwt-decode";
import { errorFormatter } from "../../utils/formatUtils";

const CONTROLLER = new AbortController();

const AXIOS_BASE_CONFIG  = {
    timeout: 20000,
    formSerializer: { metaTokens: false, indexes: null },
    signal: CONTROLLER.signal,
    headers: {    
        "Content-Type": 'multipart/form-data',
        "Authorization": localStorage.getItem("access") ? `Bearer ${localStorage.getItem("access")}` : ""
    }
};

export const userAPI = axios.create({
    ...AXIOS_BASE_CONFIG,
    baseURL: `${ externalEndpoints.prefix_user}`,
});

export const dataAPI = axios.create({
    ...AXIOS_BASE_CONFIG,
    baseURL: `${externalEndpoints.prefix_data}`,
});

// Constants
export const PUBLIC_PAGES = ["/menu", "/login", "/register", "/"];

// Create global context
export const GlobalContext = createContext<any>({});


export const DEFAULT_USER = {
    username: "",
    joinDate: "",
    isStaff: localStorage.getItem("isStaff") === "true" ? true : false,
    role: localStorage.getItem("role") ?? ""
};

// Create Layout
function AppLayout () {

    const { feedback: [, setFeedback], user: [, setUser] } = useContext(GlobalContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Reset feedback and value when page changes
    useEffect(() => setFeedback([]), [pathname, setFeedback]);

    // Create interceptors to check if tokens are valid and redirect if unauthorized
    useEffect(() => {

        // Request interceptor
        axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            if (config.url !== externalEndpoints.refresh ) {

                const { exp }: any = jwt_decode(localStorage.getItem("access") ?? "");

                if (Date.now() > (exp * 1000)) {

                    // Try refreshing token if access token expired

                    userAPI.post(externalEndpoints.refresh!, {
                        refresh: localStorage.getItem("refresh")
                    }).then((response: AxiosResponse) => {
                        console.log("setting new access token");
                        console.log("response");
                        changeTokens(response.data.access, setUser);
                    });
                }
        }
            return config
        }, (error: AxiosError) => {
            console.log(error);
            Promise.reject(error)
        });

        // Response interceptor
        dataAPI.interceptors.response.use((response: AxiosResponse) => {
            setFeedback([]);
            return response
        }, (error: AxiosError) => {
            // Display error
            console.log(error);
            setFeedback(errorFormatter(error));

            // Redirect to login if unauthrorized
            console.log("redirecting to login");
            if (pathname !== internalEndpoints.login && error.response?.status === 401) {
                navigate(internalEndpoints.logout!);
            }
        });
    }, []);

    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    )
};


// Create router
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={ <AppLayout /> } errorElement={ <RootErrorBoundary /> }>
            <Route index element={ <Home /> } />
            <Route path={ internalEndpoints.menu! } element={ <Menu /> } loader={ MenuLoader } shouldRevalidate={ () => true }>
                <Route path={ internalEndpoints.menuCreate! } element={ <MenuCreateForm /> } />
                <Route path={ internalEndpoints.menuUpdate! } element={ <MenuUpdateForm /> } />
            </Route> 
            <Route path={ internalEndpoints.login! } element={ <Login />} />
            <Route path={ internalEndpoints.logout! } element={ <Logout />} />
            <Route path={ internalEndpoints.register! } element={ <Register /> } />
            
            {/* Create privateroute to redirect to login if user is not logged in when accessing non-public pages */}
            <Route path={ internalEndpoints.home! } element={ <PrivateRoute />}>
                <Route path={ internalEndpoints.profile! } 
                    element={ <Profile />} 
                    loader={ UserLoader }
                    shouldRevalidate={({ nextUrl }) => nextUrl.pathname === internalEndpoints.profile }
                />
                <Route 
                    path={ internalEndpoints.dashboard! } element={ <Dashboard /> } 
                    shouldRevalidate={({ nextUrl }) => nextUrl.pathname === internalEndpoints.dashboard } 
                />

                <Route path={ internalEndpoints.inventory! } 
                    element={ <Inventory /> } 
                    loader={ InventoryLoader } 
                    shouldRevalidate={({ nextUrl }) => nextUrl.pathname === internalEndpoints.inventory }
                >
                    <Route path={ internalEndpoints.inventoryCreate! } element={ <InventoryCreateForm /> } />
                    <Route path={ internalEndpoints.inventoryUpdate! } element={ <InventoryUpdateForm /> } />
                </Route>
                <Route path={ internalEndpoints.orders! } 
                    element={ <Orders />} 
                    loader={ OrdersLoader }
                    shouldRevalidate={({ nextUrl }) => nextUrl.pathname === internalEndpoints.orders }
                >
                    <Route path={ internalEndpoints.ordersCreate! } element={ <OrderCreateForm /> } />
                    <Route path={ internalEndpoints.ordersUpdate! } element={ <OrderUpdateForm /> } />
                    <Route path={ internalEndpoints.ordersArchive! } element={ <ArchivedOrders /> } loader={ OrdersArchiveLoader }/>
                </Route>
            </Route>
        </Route>
    )
);


export interface User {
    username: string,
    joinDate: string,
    isStaff: boolean,
    role: string
}

// Create App
function App() {
    // Set global app states
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") ?? "light-mode");
    const [feedback, setFeedback] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>(DEFAULT_USER);

    const globalContextValue = {
        // App states
        theme: [theme, setTheme],
        
        // API states
        loading: [loading, setLoading],
        feedback: [feedback, setFeedback],

        // User states
        user: [user, setUser]

    };

    return (
        <GlobalContext.Provider value={ globalContextValue }>
            <div className={`App ${ theme }`}>
                <RouterProvider router={ router }/>
            </div>
        </GlobalContext.Provider>
    )
}

export default App;
