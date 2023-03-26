import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './style/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Navbar from './components/navbar';
import { useState } from 'react';
import Menu from "./components/menu";
function App() {
    var _a = useState("light-mode"), theme = _a[0], setTheme = _a[1];
    return (_jsxs("div", __assign({ className: "App ".concat(theme) }, { children: [_jsx(Navbar, { theme: theme, setTheme: setTheme }), _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard/", element: _jsx(Dashboard, { theme: theme }) }), _jsx(Route, { path: "/menu/", element: _jsx(Menu, { theme: theme }) })] }) })] })));
}
export default App;
