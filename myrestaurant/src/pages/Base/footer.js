import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../../styles/footer.scss";
import { ReactComponent as Logo } from "../../images/moonlight-logo.svg";
import { useContext } from 'react';
import { ThemeContext } from './App';
function Footer() {
    return (_jsx(Navbar, __assign({ expand: "xs", className: "footer ".concat(useContext(ThemeContext)) }, { children: _jsx(Container, { children: _jsxs(Navbar.Brand, __assign({ href: "/" }, { children: ["MOONLIGHT CAFE", _jsx(Logo, { className: "icon footer-logo" })] })) }) })));
}
export default Footer;
