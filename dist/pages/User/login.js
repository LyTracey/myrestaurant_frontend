import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState, useRef } from "react";
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
    const [login, setLogin] = useState({
        username: "",
        password: ""
    });
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState([]);
    // Set variables
    const navigationRef = useRef(useNavigate());
    // Handle state
    const handleData = (property, value) => {
        setLogin(Object.assign(Object.assign({}, login), { [property]: value }));
    };
    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {
            // Post request to get jwt token
            userAPI.post(`${endpoints["login"]}`, {
                username: login.username,
                password: login.password,
            }).then((response) => {
                sessionStorage.setItem("access", response.data.access);
                sessionStorage.setItem("isStaff", response.data.isStaff);
                props.setIsStaff(response.data.isStaff);
                sessionStorage.setItem("username", login.username);
                props.setRole(response.data.role);
                sessionStorage.setItem("role", response.data.role);
                sessionStorage.setItem("loggedIn", "true");
                props.setLoggedIn(true);
            }).catch((error) => {
                setFeedback(errorFormatter(error));
            }).finally(() => {
                if (sessionStorage.getItem("loggedIn") === "true" ? true : false) {
                    navigationRef.current("/profile");
                    window.location.reload();
                }
            });
        }
        setValidated(true);
    };
    return (_jsxs(Container, Object.assign({ className: `login-form page-form ${useContext(ThemeContext)}` }, { children: [_jsxs(Form, Object.assign({ noValidate: true, validated: validated, onSubmit: e => handleSubmit(e) }, { children: [_jsx("h2", Object.assign({ className: "title" }, { children: "Login" })), _jsx("ul", Object.assign({ className: "error" }, { children: feedback.map((item, i) => _jsx("li", { children: item }, i)) })), _jsxs(Form.Group, Object.assign({ as: Row, xs: 1, className: "group username" }, { children: [_jsx(Form.Label, Object.assign({ className: "left-label" }, { children: "Username" })), _jsxs(Col, Object.assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "text", placeholder: "Enter username", name: "username", onChange: e => handleData(e.target.name, e.target.value), required: true }), _jsx(Form.Control.Feedback, Object.assign({ type: 'invalid' }, { children: "Please enter a username." }))] }))] })), _jsxs(Form.Group, Object.assign({ as: Row, xs: 1, className: "group password" }, { children: [_jsx(Form.Label, Object.assign({ className: "left-label" }, { children: "Password" })), _jsxs(Col, Object.assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "password", name: "password", placeholder: "Enter password", onChange: e => handleData(e.target.name, e.target.value), required: true }), _jsx(Form.Control.Feedback, Object.assign({ type: 'invalid' }, { children: "Please enter a password." }))] }))] })), _jsx(Row, Object.assign({ className: "form-actions" }, { children: _jsx(Button, Object.assign({ className: "submit", type: "submit" }, { children: "Submit" })) }))] })), _jsx(Row, Object.assign({ className: "extra-link" }, { children: _jsx(Button, Object.assign({ as: "a", href: "/register" }, { children: "Register" })) }))] })));
}
export default Login;
