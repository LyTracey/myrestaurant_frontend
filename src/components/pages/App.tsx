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
import { internalEndpoints } from '../../data/endpoints';
import Profile from './User/profile';
import InventoryForm from "./Inventory/inventoryForm";
import { InventoryLoader, MenuLoader, OrdersLoader, OrdersArchiveLoader, UserLoader } from "../modules/loaders";
import MenuForm from "./Menu/menuForm";
import RootErrorBoundary from "../modules/errors";
import OrderForm from "./Orders/ordersForm";
import { createInterceptors, dataAPI, userAPI } from "../modules/axiosInstances";

// Create global context
export const GlobalContext = createContext<any>({});

// Constants
export const PUBLIC_PAGES = ["/menu", "/login", "/register", "/"];

// Define global user
export interface User {
    username: string,
    joinDate: string,
    isStaff: boolean,
    role: string
}

export const DEFAULT_USER = {
    username: "",
    joinDate: "",
    isStaff: localStorage.getItem("isStaff") === "true" ? true : false,
    role: localStorage.getItem("role") ?? ""
};


// Create Layout
function AppLayout () {

    const { feedback: [, setFeedback], loading: [, setLoading], user: [, setUser] } = useContext(GlobalContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Reset feedback and value when page changes
    useEffect(() => {
        setFeedback([]);
        window.scrollTo(0, 0);
    }, [pathname, setFeedback]);


    // Create interceptors to check if tokens are valid and redirect if unauthorized
    useEffect(() => {
        createInterceptors({
            axiosInstance: dataAPI,
            setLoading: setLoading,
            setUser: setUser, 
            setFeedback: setFeedback,
            navigate: navigate
        });

        createInterceptors({
            axiosInstance: userAPI,
            setLoading: setLoading,
            setUser: setUser, 
            setFeedback: setFeedback,
            navigate: navigate
        });
         
    }, [setFeedback, setLoading, setUser]);

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

            <Route path={ internalEndpoints.menu! } element={ <Menu /> } loader={ MenuLoader } >
                <Route path={ internalEndpoints.menuCreate! } element={ <MenuForm /> } />
                <Route path={ internalEndpoints.menuUpdate! } element={ <MenuForm /> } />
            </Route> 

            <Route path={ internalEndpoints.login! } element={ <Login />} />
            <Route path={ internalEndpoints.logout! } element={ <Logout />} />
            <Route path={ internalEndpoints.register! } element={ <Register /> } />
            
            {/* Create privateroute to redirect to login if user is not logged in when accessing non-public pages */}
            <Route path={ internalEndpoints.home! } element={ <PrivateRoute />}>
                <Route path={ internalEndpoints.profile! } 
                    element={ <Profile />} 
                    loader={ UserLoader }
                />

                <Route 
                    path={ internalEndpoints.dashboard! } element={ <Dashboard /> }  
                />

                <Route path={ internalEndpoints.inventory! } 
                    element={ <Inventory /> } 
                    loader={ InventoryLoader } 
                >
                    <Route path={ internalEndpoints.inventoryCreate! } element={ <InventoryForm /> } />
                    <Route path={ internalEndpoints.inventoryUpdate! } element={ <InventoryForm /> } />
                </Route>
                <Route path={ internalEndpoints.orders! } element={ <Orders /> } loader={ OrdersLoader }>
                    <Route path={ internalEndpoints.ordersCreate! } element={ <OrderForm /> } />
                    <Route path={ internalEndpoints.ordersUpdate! } element={ <OrderForm /> } />
                </Route>
                <Route path={ internalEndpoints.ordersArchive! } element={ <ArchivedOrders /> } loader={ OrdersArchiveLoader }/>
            </Route>
        </Route>
    )
);


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
