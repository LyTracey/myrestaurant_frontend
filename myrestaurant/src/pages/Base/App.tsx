import '../../styles/App.scss';
import { Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Dashboard from '../Dashboard/dashboard';
import Navbar from '../Base/navbar';
import Menu from "../Menu/menu";
import Inventory from '../Inventory/inventory';
import Orders from '../Orders/orders';
import Footer from '../Base/footer';
import ArchivedOrders from '../Orders/ordersArchive';
import Home from '../Home/home';
import Register from '../Login/register';
import Login from '../Login/login';
import Logout from '../Login/logout';
import PrivateRoute from './privateRoute';
import endpoints from '../../data/endpoints';
import axios from "axios";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse, AxiosError } from 'axios';

// Create ThemeContext
export const ThemeContext = createContext('light-mode');

function App() {

    // Set states
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true" ? true : false);

    // Create axios user and restaurant instances
    const userAPI = axios.create({
        baseURL: `${endpoints["prefix_user"]}`,
        timeout: 1000
    });

    const dataAPI = axios.create({
        headers: {
            "Content-Type": 'multipart/form-data',
            "Authorization": `Bearer ${sessionStorage.getItem("access")}`
        },
        baseURL: `${endpoints["prefix"]}`,
        timeout: 1000,
        formSerializer: { metaTokens: false, indexes: null }
    });

    const navigate = useNavigate();
    const navigationRef = useRef(navigate);

    const checkTokens = async () => {
        if (sessionStorage.getItem("access")) {
            // Check if access token exsits
            await userAPI.post(
                `${endpoints["verify"]}`,
                {token: sessionStorage.getItem("access")}
            ).catch(async () => {
                // If access token is invalid, try refreshing token
                await userAPI.post(
                    `${endpoints["refresh"]}`,
                ).then((response: AxiosResponse) => {
                    // If refresh token valid, set new access token
                    sessionStorage.setItem("access", response.data.access);
                    sessionStorage.setItem("loggedIn", "true");
                    setLoggedIn(true);
                })
                .catch(() => {
                    // If refresh token invalid, remove access token and make loggedIn false
                    sessionStorage.removeItem("access");
                    sessionStorage.setItem("loggedIn", "false");
                    setLoggedIn(false);
                    navigationRef.current("/login");
                });
            }
            );
        } else {
            setLoggedIn(false);
            navigationRef.current("/login");
        }
    };

    dataAPI.interceptors.request.use(async (config: any) => {
        await checkTokens();
        return config
    }, (error: AxiosError) => {
        return Promise.reject(error);
    });
    
    
    return (
        <div className={`App ${ theme }`}>
            <ThemeContext.Provider value={theme}>
                <Navbar theme={ theme } setTheme={ setTheme } loggedIn={ loggedIn } />
                    <Routes>
                        <Route index element={ <Home /> } />
                        <Route path="/menu/" element={ <Menu dataAPI={ dataAPI } /> } /> 
                        <Route path="/login/" element={ <Login loggedIn={ loggedIn } setLoggedIn={ setLoggedIn } userAPI={ userAPI } />} />
                        <Route path="/logout/" element={ <Logout setLoggedIn={ setLoggedIn }/>} />
                        <Route path="/register/" element={ <Register userAPI={ userAPI } /> } />
                        <Route path="/" element={ <PrivateRoute loggedIn={ loggedIn }/>}>
                            <Route path="/dashboard/" element={ <Dashboard dataAPI={ dataAPI } /> } />
                            <Route path="/inventory/" element={ <Inventory dataAPI={ dataAPI } /> } />
                            <Route path="/orders/" element={ <Orders dataAPI={ dataAPI } />} />
                            <Route path="/orders/archive" element={ <ArchivedOrders dataAPI={ dataAPI } /> } />
                        </Route>
                    </Routes>
                <Footer />
            </ThemeContext.Provider>
        </div>
    )
}

export default App;
