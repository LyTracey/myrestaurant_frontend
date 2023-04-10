import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './style/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Navbar from './components/navbar';
import { useState } from 'react';
import Menu from "./components/menu";
import { Inventory } from './components/inventory';
function App() {
    var _a;
    var _b = useState((_a = localStorage.getItem("theme")) !== null && _a !== void 0 ? _a : "light-mode"), theme = _b[0], setTheme = _b[1];
    return (_jsxs("div", __assign({ className: "App ".concat(theme) }, { children: [_jsx(Navbar, { theme: theme, setTheme: setTheme }), _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard/", element: _jsx(Dashboard, { theme: theme }) }), _jsx(Route, { path: "/menu/", element: _jsx(Menu, { theme: theme }) }), _jsx(Route, { path: "/inventory/", element: _jsx(Inventory, { theme: theme }) })] }) })] })));
}
export default App;
