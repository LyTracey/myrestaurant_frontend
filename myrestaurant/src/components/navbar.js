import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../style/navbar.scss";
import { ReactComponent as SunIcon } from '../images/icons/sun.svg';
import { ReactComponent as MoonIcon } from '../images/icons/moon.svg';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Logo } from "../images/moonlight-logo.svg";
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
    return (_jsx(Navbar, __assign({ className: props.theme, collapseOnSelect: true, sticky: "top", expand: "md" }, { children: _jsxs(Container, { children: [_jsxs(Navbar.Brand, __assign({ href: "/", className: props.theme }, { children: ["MOONLIGHT CAFE", _jsx(Logo, { className: "logo" })] })), _jsx(Navbar.Toggle, { className: props.theme, "aria-controls": "responsive-navbar-nav" }), _jsxs(Navbar.Collapse, __assign({ role: "navigation" }, { children: [_jsx(Nav.Link, __assign({ href: "/dashboard/" }, { children: "Dashboard" })), _jsx(Nav.Link, __assign({ href: "/menu/" }, { children: "Menu" })), _jsx(Nav.Link, __assign({ href: "/orders/" }, { children: "Orders" })), _jsx(Nav.Link, __assign({ href: "/inventory/" }, { children: "Inventory" })), _jsx(Button, __assign({ className: "".concat(props.theme, " theme-toggle"), onClick: function () { return handleTheme(); } }, { children: props.theme === "light-mode" ?
                                (_jsxs("div", { children: [_jsx(SunIcon, { className: "theme-icon light fade-in" }), _jsx(MoonIcon, { className: "theme-icon dark fade-out" })] })) :
                                (_jsxs("div", { children: [_jsx(SunIcon, { className: "theme-icon light fade-out" }), _jsx(MoonIcon, { className: "theme-icon dark fade-in" })] })) }))] }))] }) })));
}
export default Navigate;
