import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../style/navbar.scss";
function Navigate() {
    return (_jsx(Navbar, __assign({ collapseOnSelect: true, sticky: "top", expand: "lg", bg: "dark", variant: "dark" }, { children: _jsxs(Container, { children: [_jsx(Navbar.Brand, { children: "MyRestaurant" }), _jsx(Navbar.Toggle, { "aria-controls": "responsive-navbar-nav" }), _jsxs(Navbar.Collapse, __assign({ role: "navigation" }, { children: [_jsx(Nav.Link, __assign({ className: "bg-primary", href: "/dashboard/" }, { children: "Dashboard" })), _jsx(Nav.Link, { children: "Menu" }), _jsx(Nav.Link, { children: "Orders" }), _jsx(Nav.Link, { children: "Inventory" })] }))] }) })));
}
export default Navigate;
