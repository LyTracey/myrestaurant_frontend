import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../style/footer.scss";
import { ReactComponent as Logo } from "../images/moonlight-logo.svg";
import { useContext } from 'react';
import { ThemeContext } from './contexts';
function Footer() {
    return (_jsxs(Navbar, __assign({ expand: "xs", className: "footer ".concat(useContext(ThemeContext)) }, { children: [_jsxs(Container, __assign({ className: 'links' }, { children: [_jsx(Nav.Link, __assign({ className: 'about' }, { children: "About" })), _jsx(Nav.Link, __assign({ className: 'feedback' }, { children: "Give Feedback" })), _jsx(Nav.Link, __assign({ className: 'other-projects' }, { children: "Other Projects" }))] })), _jsx(Container, { children: _jsxs(Navbar.Brand, { children: ["MOONLIGHT CAFE", _jsx(Logo, { className: "footer-logo" })] }) })] })));
}
export default Footer;
