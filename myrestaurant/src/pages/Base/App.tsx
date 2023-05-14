import '../../styles/App.scss';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, createContext, useRef } from 'react';
import axios, { AxiosResponse, AxiosError } from "axios";
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

// Create ThemeContext
export const ThemeContext = createContext('light-mode');

function App() {

    // Set states
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true" ? true : false);
    const [isStaff, setIsStaff] = useState(sessionStorage.getItem("isStaff") === "true" ? true : false);
    const navigate = useNavigate();
    const navigationRef = useRef(navigate);

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
                    navigationRef.current("/logout");
                });
            }
            );
        } else {
            sessionStorage.setItem("loggedIn", "false");
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
                <Navbar theme={ theme } setTheme={ setTheme } loggedIn={ loggedIn } isStaff={ isStaff } />
                    <Routes>
                        <Route index element={ <Home /> } />
                        <Route path="/menu/" element={ <Menu dataAPI={ dataAPI } /> } /> 
                        <Route path="/login/" element={ <Login setLoggedIn={ setLoggedIn } setIsStaff={ setIsStaff } userAPI={ userAPI } />} />
                        <Route path="/logout/" element={ <Logout setLoggedIn={ setLoggedIn } setIsStaff={ setIsStaff } />} />
                        <Route path="/register/" element={ <Register userAPI={ userAPI } /> } />
                        <Route path="/" element={ <PrivateRoute loggedIn={ loggedIn }/>}>
                            <Route path="/profile/" element={ <Profile isStaff={ isStaff } userAPI={ userAPI } />} />
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
