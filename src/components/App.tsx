import "../styles/App.scss";
import { Route, createBrowserRouter, createRoutesFromElements, Outlet, RouterProvider, useLocation, useRouteError } from 'react-router-dom';
import { useState, createContext, useEffect, useContext } from 'react';
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
import { internalEndpoints, externalEndpoints } from '../data/endpoints';
import Profile from './pages/User/profile';
import { InventoryCreateForm, InventoryUpdateForm } from './pages/Inventory/inventoryForms';
import { InventoryLoader, MenuLoader, OrdersLoader, OrdersArchiveLoader, UserLoader } from "./modules/loaders";
import { MenuCreateForm, MenuUpdateForm } from "./pages/Menu/menuForms";
import { OrderCreateForm, OrderUpdateForm } from "./pages/Orders/ordersForm";
import { InternalError, NotFound, SomethingWentWring, Forbidden } from "./modules/errors";
import axios, {AxiosResponse, InternalAxiosRequestConfig, AxiosError} from "axios";
import { changeAccessToken } from "../utils/apiUtils";

const CONTROLLER = new AbortController();

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
    headers: HEADERS,
    withCredentials: true
});

export const dataAPI = axios.create({
    headers: HEADERS,
    baseURL: `${externalEndpoints["prefix"]}`,
    timeout: 20000,
    formSerializer: FORMSERIALIZER,
    signal: CONTROLLER.signal,
    withCredentials: true
});

// Constants
export const PUBLIC_PAGES = ["/menu", "/login", "/register", "/"];

// Create global context
export const GlobalContext = createContext<any>({});

// Create Layout
function AppLayout () {

    const { feedback: [, setFeedback] } = useContext(GlobalContext);
    const { pathname } = useLocation();

    // Reset feedback and value when page changes
    useEffect(() => setFeedback([]), [pathname]);

    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
        </>
    )
};

// Create root error boundary
function RootErrorBoundary () {
    const error: any = useRouteError();

    console.log(error);

    switch (error.response?.status) {
        case 401:
            return <Logout />
        case 403:
            return <Forbidden />
        case 404: 
            return <NotFound />
        case 500:
            return <InternalError />
        default:
            return <SomethingWentWring />

    }

};


// Create router
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={ <AppLayout /> } errorElement={ <RootErrorBoundary /> }>
            <Route index element={ <Home /> } />
            <Route path={ internalEndpoints.menu! } element={ <Menu /> } loader={ MenuLoader } >
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
                <Route path={ internalEndpoints.dashboard! } element={ <Dashboard /> } 
                    shouldRevalidate={({ nextUrl }) => nextUrl.pathname === internalEndpoints.dashboard } />
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
    isStaff: boolean,
    joinDate: string,
    role: string
}

// Create App
function App() {
    // Set global app states
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") ?? "light-mode");
    const [feedback, setFeedback] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User>({
        username: sessionStorage.getItem("username") ?? "",
        isStaff: sessionStorage.getItem("isStaff") === "true",
        joinDate: sessionStorage.getItem("joinDate") ?? "",
        role: sessionStorage.getItem("role") ?? ""
    });

    // Create request interceptor to check if tokens are valid
    useEffect(() => {
        dataAPI.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            if (config.url !== externalEndpoints.refresh ) {

                const expiry = new Date(sessionStorage.getItem("expiry") ?? "");

                if (new Date() > expiry) {
                    // Try refreshing token if access token expired
                    userAPI.post(`${ externalEndpoints.refresh }`, {}).then((response: AxiosResponse) => {
                        console.log("setting new access token");
                        changeAccessToken(response.data.access)
                    }).catch((error: AxiosError) => console.log(error));
                }
        }
            return config
        }, (error: AxiosError) => {
            Promise.reject(error)
        });
    }, []);


    const globalContextValue = {
        // App states
        theme: [theme, setTheme],
        
        // API states
        loading: [loading, setLoading],
        feedback: [feedback, setFeedback],

        // User state
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
