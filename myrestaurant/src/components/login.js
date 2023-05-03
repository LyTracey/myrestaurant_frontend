import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import axios from "axios";
import endpoints from "../data/endpoints";
import { useContext } from 'react';
import { ThemeContext } from './contexts';
import { useNavigate } from 'react-router-dom';
import "../style/register.scss";
function Login(props) {
    // Set state
    var _a = useState({
        email: "",
        password: ""
    }), login = _a[0], setLogin = _a[1];
    var navigate = useNavigate();
    // Handle state
    var handleData = function (property, value) {
        var _a;
        setLogin(__assign(__assign({}, login), (_a = {}, _a[property] = value, _a)));
    };
    // Handle form submit
    var handleSubmit = function (e) {
        e.preventDefault();
        // Post request to get jwt token
        axios.post("".concat(endpoints["prefix_user"]).concat(endpoints["login"]), {
            email: login.email,
            password: login.password,
        }).then(function (response) {
            sessionStorage.setItem("access", response.data.access);
            sessionStorage.setItem("loggedIn", "true");
            props.setLoggedIn(true);
            navigate("/");
        }).catch(function (error) { return console.log(error); });
    };
    return (_jsxs(Container, __assign({ className: "login ".concat(useContext(ThemeContext)), fluid: true }, { children: [_jsxs(Form, __assign({ onSubmit: function (e) { return handleSubmit(e); } }, { children: [_jsx("h2", __assign({ className: "title" }, { children: "Login" })), _jsxs(Form.Group, __assign({ className: "group email" }, { children: [_jsx(Form.Label, { children: "E-mail" }), _jsx(Form.Control, { type: "email", placeholder: "Enter email", name: "email", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true })] })), _jsxs(Form.Group, __assign({ className: "group password" }, { children: [_jsx(Form.Label, { children: "Password" }), _jsx(Form.Control, { type: "password", name: "password", placeholder: "Enter password", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true })] })), _jsx(Row, __assign({ className: "submit" }, { children: _jsx(Button, __assign({ className: "submit-button", type: "submit" }, { children: "Submit" })) }))] })), _jsx(Row, __assign({ className: "register-link" }, { children: _jsx(Button, __assign({ as: "a", href: "/register" }, { children: "Register" })) }))] })));
}
export default Login;
