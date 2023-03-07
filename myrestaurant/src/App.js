import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import Navbar from './components/navbar';
function App() {
    return (_jsxs("div", __assign({ className: "App" }, { children: [_jsx(Navbar, {}), _jsx(Router, { children: _jsx(Routes, { children: _jsx(Route, { path: "/dashboard/", element: _jsx(Dashboard, {}) }) }) })] })));
}
export default App;
