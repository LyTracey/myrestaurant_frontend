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
import { ThemeContext } from './App';
import { useContext } from 'react';
function Navigate(props) {
    const handleTheme = () => {
        if (localStorage.getItem("theme") === "light-mode") {
            props.setTheme("dark-mode");
            localStorage.setItem("theme", "dark-mode");
        }
        else {
            props.setTheme("light-mode");
            localStorage.setItem("theme", "light-mode");
        }
    };
    return (_jsx(Navbar, Object.assign({ className: useContext(ThemeContext), collapseOnSelect: true, sticky: "top", expand: "md" }, { children: _jsxs(Container, Object.assign({ fluid: true }, { children: [_jsxs(Navbar.Brand, Object.assign({ href: "/" }, { children: ["MOONLIGHT CAFE", _jsx(Logo, { className: "icon logo" })] })), _jsx(Navbar.Toggle, Object.assign({ "aria-controls": "responsive-navbar-nav" }, { children: _jsx(Collapse, { className: "icon" }) })), _jsxs(Navbar.Collapse, Object.assign({ role: "navigation" }, { children: [_jsxs(Nav, Object.assign({ activeKey: props.location.pathname }, { children: [!props.isStaff && _jsx(Nav.Link, Object.assign({ href: "/" }, { children: "Home" })), _jsx(Nav.Link, Object.assign({ href: "/menu" }, { children: "Menu" })), (props.isStaff && ["MANAGER", "SALES"].includes(props.role)) && _jsx(Nav.Link, Object.assign({ href: "/dashboard" }, { children: "Dashboard" })), (props.isStaff && ["MANAGER", "SALES"].includes(props.role)) && _jsx(Nav.Link, Object.assign({ href: "/orders" }, { children: "Orders" })), (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) && _jsx(Nav.Link, Object.assign({ href: "/inventory" }, { children: "Inventory" })), props.loggedIn && _jsx(Nav.Link, Object.assign({ href: "/profile" }, { children: "Profile" })), props.loggedIn ?
                                    _jsx(Nav.Link, Object.assign({ href: "/logout" }, { children: "Logout" }))
                                    : _jsx(Nav.Link, Object.assign({ href: "/login" }, { children: "Login" }))] })), _jsx(Button, Object.assign({ className: `${props.theme} theme-toggle`, onClick: () => handleTheme() }, { children: props.theme === "light-mode" ?
                                (_jsxs("div", { children: [_jsx(SunIcon, { className: "theme-icon light fade-in" }), _jsx(MoonIcon, { className: "theme-icon dark fade-out" })] })) :
                                (_jsxs("div", { children: [_jsx(SunIcon, { className: "theme-icon light fade-out" }), _jsx(MoonIcon, { className: "theme-icon dark fade-in" })] })) }))] }))] })) })));
}
export default Navigate;
