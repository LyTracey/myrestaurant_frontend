import { __assign, __awaiter, __generator } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../styles/App.scss';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, createContext, useRef } from 'react';
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
import { useEffect } from 'react';
// Create ThemeContext
export var ThemeContext = createContext('light-mode');
function App() {
    var _this = this;
    var _a;
    // Set states
    var _b = useState((_a = localStorage.getItem("theme")) !== null && _a !== void 0 ? _a : "light-mode"), theme = _b[0], setTheme = _b[1];
    var _c = useState(sessionStorage.getItem("loggedIn") === "true" ? true : false), loggedIn = _c[0], setLoggedIn = _c[1];
    var _d = useState(sessionStorage.getItem("isStaff") === "true" ? true : false), isStaff = _d[0], setIsStaff = _d[1];
    var navigate = useNavigate();
    var navigationRef = useRef(navigate);
    // Create axios user and restaurant instances
    var userAPI = axios.create({
        baseURL: "".concat(endpoints["prefix_user"]),
        timeout: 1000
    });
    useEffect(function () { return console.log(isStaff); });
    var dataAPI = axios.create({
        headers: {
            "Content-Type": 'multipart/form-data',
            "Authorization": "Bearer ".concat(sessionStorage.getItem("access"))
        },
        baseURL: "".concat(endpoints["prefix"]),
        timeout: 1000,
        formSerializer: { metaTokens: false, indexes: null }
    });
    var checkTokens = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sessionStorage.getItem("access")) return [3 /*break*/, 2];
                    // Check if access token exsits
                    return [4 /*yield*/, userAPI.post("".concat(endpoints["verify"]), { token: sessionStorage.getItem("access") }).catch(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // If access token is invalid, try refreshing token
                                    return [4 /*yield*/, userAPI.post("".concat(endpoints["refresh"])).then(function (response) {
                                            // If refresh token valid, set new access token
                                            sessionStorage.setItem("access", response.data.access);
                                            sessionStorage.setItem("loggedIn", "true");
                                            setLoggedIn(true);
                                        })
                                            .catch(function () {
                                            // If refresh token invalid, remove access token and make loggedIn false
                                            navigationRef.current("/logout");
                                        })];
                                    case 1:
                                        // If access token is invalid, try refreshing token
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // Check if access token exsits
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    sessionStorage.setItem("loggedIn", "false");
                    setLoggedIn(false);
                    navigationRef.current("/login");
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    dataAPI.interceptors.request.use(function (config) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkTokens()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, config];
            }
        });
    }); }, function (error) {
        return Promise.reject(error);
    });
    return (_jsx("div", __assign({ className: "App ".concat(theme) }, { children: _jsxs(ThemeContext.Provider, __assign({ value: theme }, { children: [_jsx(Navbar, { theme: theme, setTheme: setTheme, loggedIn: loggedIn, isStaff: isStaff }), _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "/menu/", element: _jsx(Menu, { dataAPI: dataAPI }) }), _jsx(Route, { path: "/login/", element: _jsx(Login, { setLoggedIn: setLoggedIn, setIsStaff: setIsStaff, userAPI: userAPI }) }), _jsx(Route, { path: "/logout/", element: _jsx(Logout, { setLoggedIn: setLoggedIn, setIsStaff: setIsStaff }) }), _jsx(Route, { path: "/register/", element: _jsx(Register, { userAPI: userAPI }) }), _jsxs(Route, __assign({ path: "/", element: _jsx(PrivateRoute, { loggedIn: loggedIn }) }, { children: [_jsx(Route, { path: "/profile/", element: _jsx(Profile, { isStaff: isStaff, userAPI: userAPI }) }), _jsx(Route, { path: "/dashboard/", element: _jsx(Dashboard, { dataAPI: dataAPI }) }), _jsx(Route, { path: "/inventory/", element: _jsx(Inventory, { dataAPI: dataAPI }) }), _jsx(Route, { path: "/orders/", element: _jsx(Orders, { dataAPI: dataAPI }) }), _jsx(Route, { path: "/orders/archive", element: _jsx(ArchivedOrders, { dataAPI: dataAPI }) })] }))] }), _jsx(Footer, {})] })) })));
}
export default App;
