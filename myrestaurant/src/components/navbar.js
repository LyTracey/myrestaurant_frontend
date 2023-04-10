import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../style/navbar.scss";
import Form from 'react-bootstrap/Form';
function Navigate(props) {
    var handleTheme = function (_a) {
        var target = _a.target;
        if (target.checked) {
            props.setTheme("dark-mode");
            localStorage.setItem("theme", "dark-mode");
        }
        else {
            props.setTheme("light-mode");
            localStorage.setItem("theme", "light-mode");
        }
    };
    return (_jsx(Navbar, __assign({ className: props.theme, collapseOnSelect: true, sticky: "top", expand: "lg" }, { children: _jsxs(Container, { children: [_jsx(Navbar.Brand, __assign({ className: props.theme }, { children: "MyRestaurant" })), _jsx(Navbar.Toggle, { className: props.theme, "aria-controls": "responsive-navbar-nav" }), _jsxs(Navbar.Collapse, __assign({ role: "navigation" }, { children: [_jsx(Nav.Link, __assign({ href: "/dashboard/" }, { children: "Dashboard" })), _jsx(Nav.Link, __assign({ href: "/menu/" }, { children: "Menu" })), _jsx(Nav.Link, __assign({ href: "/orders/" }, { children: "Orders" })), _jsx(Nav.Link, __assign({ href: "/inventory/" }, { children: "Inventory" })), _jsx(Form, { children: _jsx(Form.Check, { className: "".concat(props.theme, "-reversed"), id: "theme-btn", type: "switch", checked: props.theme === "light-mode" ? false : true, onChange: function (e) { return handleTheme(e); } }) })] }))] }) })));
}
export default Navigate;
