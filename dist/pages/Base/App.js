import { __awaiter } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../styles/App.scss';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, createContext, useRef, useEffect } from 'react';
import axios from "axios";
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
export const ThemeContext = createContext('light-mode');
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
    var _a;
    // Set states
    const [theme, setTheme] = useState((_a = localStorage.getItem("theme")) !== null && _a !== void 0 ? _a : "light-mode");
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("loggedIn") === "true" ? true : false);
    const [isStaff, setIsStaff] = useState(sessionStorage.getItem("isStaff") === "true" ? true : false);
    const [role, setRole] = useState(sessionStorage.getItem("role"));
    const navigationRef = useRef(useNavigate());
    const location = useRef(useLocation());
    useEffect(() => {
        // Create request interceptor to check if tokens are valid
        dataAPI.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            yield checkTokens(navigationRef, setLoggedIn, location);
            return config;
        }), (error) => {
            return Promise.reject(error);
        });
        // Create repsonse interceptor to redirect when certain errors appear
        dataAPI.interceptors.response.use((response) => __awaiter(this, void 0, void 0, function* () {
            return response;
        }), (error) => {
            var _a;
            switch ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) {
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
        });
    }, []);
    return (_jsx("div", Object.assign({ className: `App ${theme}` }, { children: _jsxs(ThemeContext.Provider, Object.assign({ value: theme }, { children: [_jsx(Navbar, { theme: theme, setTheme: setTheme, loggedIn: loggedIn, isStaff: isStaff, role: role, location: location }), _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "/menu", element: _jsx(Menu, { isStaff: isStaff, role: role }) }), _jsx(Route, { path: "/login", element: _jsx(Login, { setLoggedIn: setLoggedIn, setIsStaff: setIsStaff, setRole: setRole }) }), _jsx(Route, { path: "/logout", element: _jsx(Logout, { setLoggedIn: setLoggedIn, setIsStaff: setIsStaff }) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/unauthorised", element: _jsx(Unauthorised, {}) }), _jsx(Route, { path: "/forbidden", element: _jsx(Forbidden, {}) }), _jsx(Route, { path: "/not-found", element: _jsx(NotFound, {}) }), _jsx(Route, { path: "/internal-error", element: _jsx(InternalError, {}) }), _jsxs(Route, Object.assign({ path: "/", element: _jsx(PrivateRoute, { loggedIn: loggedIn }) }, { children: [_jsx(Route, { path: "/profile", element: _jsx(Profile, { setIsStaff: setIsStaff, setRole: setRole }) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/inventory", element: _jsx(Inventory, {}) }), _jsx(Route, { path: "/orders", element: _jsx(Orders, {}) }), _jsx(Route, { path: "/orders/archive", element: _jsx(ArchivedOrders, {}) })] }))] }), _jsx(Footer, {})] })) })));
}
export default App;
