import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../style/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Navbar from './navbar';
import { useState, useEffect } from 'react';
import Menu from "./menu";
import Inventory from './inventory';
import Orders from './orders';
import Footer from './footer';
import ArchivedOrders from './ordersArchive';
import Home from './home';
import Register from './register';
import Login from './login';
import Logout from './logout';
import { ThemeContext } from './contexts';
import axios from "axios";
import { checkTokens } from './utils';
import PrivateRoute from './privateRoute';
function App() {
    var _a, _b;
    var _c = useState((_a = localStorage.getItem("theme")) !== null && _a !== void 0 ? _a : "light-mode"), theme = _c[0], setTheme = _c[1];
    var _d = useState((_b = Boolean(sessionStorage.getItem("access"))) !== null && _b !== void 0 ? _b : false), loggedIn = _d[0], setLoggedIn = _d[1];
    // Set default axios headers
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    // Set loggedIn storage on first render
    useEffect(function () {
        sessionStorage.setItem("loggedIn", "false");
    }, []);
    useEffect(function () {
        if (sessionStorage.getItem("access")) {
            var tokensValid = checkTokens();
            if (!tokensValid) {
                sessionStorage.removeItem("access");
                sessionStorage.setItem("loggedIn", "false");
                setLoggedIn(false);
            }
            axios.defaults.headers.common['Authorization'] = "Bearer ".concat(sessionStorage.getItem("access"));
        }
    });
    return (_jsx("div", __assign({ className: "App ".concat(theme) }, { children: _jsxs(ThemeContext.Provider, __assign({ value: theme }, { children: [_jsx(Navbar, { theme: theme, setTheme: setTheme, loggedIn: loggedIn }), _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/menu/", element: _jsx(Menu, {}) }), _jsx(Route, { path: "/login/", element: _jsx(Login, { setLoggedIn: setLoggedIn }) }), _jsx(Route, { path: "/logout/", element: _jsx(Logout, { setLoggedIn: setLoggedIn }) }), _jsx(Route, { path: "/register/", element: _jsx(Register, {}) }), _jsxs(Route, __assign({ path: "/", element: _jsx(PrivateRoute, { loggedIn: loggedIn }) }, { children: [_jsx(Route, { path: "/dashboard/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/inventory/", element: _jsx(Inventory, {}) }), _jsx(Route, { path: "/orders/", element: _jsx(Orders, {}) }), _jsx(Route, { path: "/orders/archive", element: _jsx(ArchivedOrders, {}) })] }))] }) }), _jsx(Footer, {})] })) })));
}
export default App;
