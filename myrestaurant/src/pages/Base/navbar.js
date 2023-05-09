import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../../styles/navbar.scss";
import { ReactComponent as SunIcon } from '../../images/icons/sun.svg';
import { ReactComponent as MoonIcon } from '../../images/icons/moon.svg';
import { ReactComponent as Collapse } from '../../images/icons/collapsed-navbar.svg';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Logo } from "../../images/moonlight-logo.svg";
import { useContext } from 'react';
import { ThemeContext } from './App';
function Navigate(props) {
    var handleTheme = function () {
        if (localStorage.getItem("theme") === "light-mode") {
            props.setTheme("dark-mode");
            localStorage.setItem("theme", "dark-mode");
        }
        else {
            props.setTheme("light-mode");
            localStorage.setItem("theme", "light-mode");
        }
    };
    return (_jsx(Navbar, __assign({ className: useContext(ThemeContext), collapseOnSelect: true, sticky: "top", expand: "md" }, { children: _jsxs(Container, __assign({ fluid: true }, { children: [_jsxs(Navbar.Brand, __assign({ href: "/" }, { children: ["MOONLIGHT CAFE", _jsx(Logo, { className: "icon logo" })] })), _jsx(Navbar.Toggle, __assign({ "aria-controls": "responsive-navbar-nav" }, { children: _jsx(Collapse, { className: "icon" }) })), _jsxs(Navbar.Collapse, __assign({ role: "navigation" }, { children: [!props.loggedIn && _jsx(Nav.Link, __assign({ href: "/" }, { children: "Home" })), _jsx(Nav.Link, __assign({ href: "/menu/" }, { children: "Menu" })), props.loggedIn && _jsx(Nav.Link, __assign({ href: "/dashboard/" }, { children: "Dashboard" })), props.loggedIn && _jsx(Nav.Link, __assign({ href: "/orders/" }, { children: "Orders" })), props.loggedIn && _jsx(Nav.Link, __assign({ href: "/inventory/" }, { children: "Inventory" })), props.loggedIn ?
                            _jsx(Nav.Link, __assign({ href: "/logout/" }, { children: "Logout" }))
                            : _jsx(Nav.Link, __assign({ href: "/login/" }, { children: "Login" })), _jsx(Button, __assign({ className: "".concat(props.theme, " theme-toggle"), onClick: function () { return handleTheme(); } }, { children: props.theme === "light-mode" ?
                                (_jsxs("div", { children: [_jsx(SunIcon, { className: "theme-icon light fade-in" }), _jsx(MoonIcon, { className: "theme-icon dark fade-out" })] })) :
                                (_jsxs("div", { children: [_jsx(SunIcon, { className: "theme-icon light fade-out" }), _jsx(MoonIcon, { className: "theme-icon dark fade-in" })] })) }))] }))] })) })));
}
export default Navigate;
