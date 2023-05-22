import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import endpoints from "../../data/endpoints";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { useNavigate } from 'react-router-dom';
import "../../styles/form.scss";
import { errorFormatter } from "../../utils/formatter";
import { userAPI } from "../Base/App";
;
function Login(props) {
    // Set states
    var _a = useState({
        username: "",
        password: ""
    }), login = _a[0], setLogin = _a[1];
    var _b = useState(false), validated = _b[0], setValidated = _b[1];
    var _c = useState([]), APIFeedback = _c[0], setAPIFeedback = _c[1];
    // Set variables
    var navigate = useNavigate();
    // Handle state
    var handleData = function (property, value) {
        var _a;
        setLogin(__assign(__assign({}, login), (_a = {}, _a[property] = value, _a)));
    };
    // Handle form submit
    var handleSubmit = function (e) {
        e.preventDefault();
        var form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {
            // Post request to get jwt token
            userAPI.post("".concat(endpoints["login"]), {
                username: login.username,
                password: login.password,
            }).then(function (response) {
                sessionStorage.setItem("access", response.data.access);
                sessionStorage.setItem("isStaff", response.data.isStaff);
                props.setIsStaff(response.data.isStaff);
                sessionStorage.setItem("username", login.username);
                props.setRole(response.data.role);
                sessionStorage.setItem("role", response.data.role);
                sessionStorage.setItem("loggedIn", "true");
                props.setLoggedIn(true);
            }).catch(function (error) {
                console.log(error);
                setAPIFeedback(errorFormatter(error));
            }).finally(function () {
                var _a;
                if ((_a = sessionStorage.getItem("loggedIn")) !== null && _a !== void 0 ? _a : false) {
                    navigate("/profile");
                    window.location.reload();
                }
            });
        }
        setValidated(true);
    };
    return (_jsxs(Container, __assign({ className: "login-form form ".concat(useContext(ThemeContext)) }, { children: [_jsxs(Form, __assign({ noValidate: true, validated: validated, onSubmit: function (e) { return handleSubmit(e); } }, { children: [_jsx("h2", __assign({ className: "title" }, { children: "Login" })), _jsx("ul", __assign({ className: "error" }, { children: APIFeedback.map(function (item, i) { return _jsx("li", { children: item }, i); }) })), _jsxs(Form.Group, __assign({ as: Row, xs: 1, className: "group username" }, { children: [_jsx(Form.Label, __assign({ className: "left-label" }, { children: "Username" })), _jsxs(Col, __assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "text", placeholder: "Enter username", name: "username", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true }), _jsx(Form.Control.Feedback, __assign({ type: 'invalid' }, { children: "Please enter a username." }))] }))] })), _jsxs(Form.Group, __assign({ as: Row, xs: 1, className: "group password" }, { children: [_jsx(Form.Label, __assign({ className: "left-label" }, { children: "Password" })), _jsxs(Col, __assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "password", name: "password", placeholder: "Enter password", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true }), _jsx(Form.Control.Feedback, __assign({ type: 'invalid' }, { children: "Please enter a password." }))] }))] })), _jsx(Row, __assign({ className: "form-actions" }, { children: _jsx(Button, __assign({ className: "submit", type: "submit" }, { children: "Submit" })) }))] })), _jsx(Row, __assign({ className: "extra-link" }, { children: _jsx(Button, __assign({ as: "a", href: "/register" }, { children: "Register" })) }))] })));
}
export default Login;
