import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import endpoints from "../data/endpoints";
import { useState } from "react";
import "../style/register.scss";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from './contexts';
function Register() {
    // Set states
    var _a = useState({
        email: "",
        password1: "",
        password2: "",
        is_staff: false
    }), newUser = _a[0], setNewUser = _a[1];
    var navigate = useNavigate();
    // Handle state
    var handleData = function (property, value) {
        var _a;
        setNewUser(__assign(__assign({}, newUser), (_a = {}, _a[property] = value, _a)));
    };
    // Handle form submit
    var handleSubmit = function (e) {
        e.preventDefault();
        // Check if passwords match
        if (newUser.password1 !== newUser.password2) {
            return "Passwords do not match.";
        }
        // Post request to create new user
        axios.post("".concat(endpoints["prefix_user"]).concat(endpoints["register"]), {
            email: newUser.email,
            password: newUser.password1,
            is_staff: newUser.is_staff
        }).then(function () {
            navigate("/");
        }).catch(function (error) { return console.log(error); });
        return "User created.";
    };
    return (_jsxs(Container, __assign({ className: "register ".concat(useContext(ThemeContext)), fluid: true }, { children: [_jsx("h2", __assign({ className: "title" }, { children: "Register" })), _jsxs(Form, __assign({ className: "form", onSubmit: function (e) { return handleSubmit(e); } }, { children: [_jsxs(Form.Group, __assign({ className: "group email" }, { children: [_jsx(Form.Label, { children: "E-mail" }), _jsx(Form.Control, { type: "email", placeholder: "Enter email", name: "email", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true })] })), _jsxs(Form.Group, __assign({ className: "group password" }, { children: [_jsx(Form.Label, { children: "Password" }), _jsx(Form.Control, { type: "password", name: "password1", placeholder: "Create password", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true })] })), _jsxs(Form.Group, __assign({ className: "group password" }, { children: [_jsx(Form.Label, { children: "Re-enter Password" }), _jsx(Form.Control, { type: "password", name: "password2", pattern: newUser.password1, placeholder: "Re-enter password", title: "Passwords do not match.", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true })] })), _jsx(Form.Group, __assign({ className: "group is-staff" }, { children: _jsx(Form.Check, { type: "checkbox", label: "Staff View", name: "is_staff", onChange: function (e) { return handleData(e.target.name, e.target.value); } }) })), _jsx(Row, __assign({ className: "submit" }, { children: _jsx(Button, __assign({ className: "submit-button", type: "submit" }, { children: "Submit" })) }))] }))] })));
}
export default Register;
