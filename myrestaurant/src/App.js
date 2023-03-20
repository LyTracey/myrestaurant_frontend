import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './style/App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import Navbar from './components/navbar';
import { useState } from 'react';
function App() {
    var _a = useState("light-mode"), theme = _a[0], setTheme = _a[1];
    return (_jsxs("div", __assign({ className: "App ".concat(theme) }, { children: [_jsx(Navbar, { theme: theme, setTheme: setTheme }), _jsx(Router, { children: _jsx(Routes, { children: _jsx(Route, { path: "/dashboard/", element: _jsx(Dashboard, { theme: theme }) }) }) })] })));
}
export default App;
