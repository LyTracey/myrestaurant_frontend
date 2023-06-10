import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import endpoints from "../../data/endpoints";
import { useState } from "react";
import "../../styles/form.scss";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { errorFormatter } from "../../utils/formatter";
import { userAPI } from "../Base/App";
;
function Register() {
    // Set states
    const [newUser, setNewUser] = useState({
        username: "",
        password1: "",
        password2: "",
        is_staff: false
    });
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState([]);
    const navigate = useNavigate();
    // Handle state
    const handleData = (property, value) => {
        setNewUser(Object.assign(Object.assign({}, newUser), { [property]: value }));
    };
    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const passwordsMatch = (newUser.password1 === newUser.password2);
        const form = e.currentTarget;
        if (form.checkValidity() === false || !passwordsMatch) {
            e.stopPropagation();
            if (!passwordsMatch) {
                setFeedback(["Please ensure passwords match."]);
            }
        }
        else {
            userAPI.post(`${endpoints["register"]}`, {
                username: newUser.username,
                password: newUser.password1,
                is_staff: newUser.is_staff
            }).then(() => {
                navigate("/");
            }).catch((error) => {
                console.log(error);
                setFeedback(errorFormatter(error));
            });
        }
        setValidated(true);
    };
    return (_jsxs(Container, Object.assign({ className: `register-form page-form ${useContext(ThemeContext)}` }, { children: [_jsx("h2", Object.assign({ className: "title" }, { children: "Register" })), _jsx("ul", Object.assign({ className: "error" }, { children: feedback.map((item, i) => _jsx("li", { children: item }, i)) })), _jsxs(Form, Object.assign({ noValidate: true, validated: validated, className: "form", onSubmit: e => handleSubmit(e) }, { children: [_jsxs(Form.Group, Object.assign({ as: Row, xs: 1, className: "group username" }, { children: [_jsx(Form.Label, Object.assign({ className: "left-label" }, { children: "Username*" })), _jsxs(Col, Object.assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "text", placeholder: "Enter username", name: "username", onChange: e => handleData(e.target.name, e.target.value), required: true }), _jsx(Form.Control.Feedback, Object.assign({ type: "invalid" }, { children: "Please enter a username." }))] }))] })), _jsxs(Form.Group, Object.assign({ as: Row, xs: 1, className: "group password" }, { children: [_jsx(Form.Label, Object.assign({ className: "left-label" }, { children: "Password*" })), _jsxs(Col, Object.assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "password", name: "password1", pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}", placeholder: "Create password", onChange: e => { handleData(e.target.name, e.target.value); }, required: true }), _jsx(Form.Control.Feedback, Object.assign({ type: "invalid" }, { children: "Required. Must contain at least one number, one uppercase letter, one lowercase letter, and at least 6 or more characters." }))] }))] })), _jsxs(Form.Group, Object.assign({ as: Row, xs: 1, className: "group password" }, { children: [_jsx(Form.Label, Object.assign({ className: "left-label" }, { children: "Re-enter Password*" })), _jsx(Col, Object.assign({ className: "field" }, { children: _jsx(Form.Control, { type: "password", name: "password2", placeholder: "Re-enter password", onChange: e => handleData(e.target.name, e.target.value), required: true }) }))] })), _jsx(Form.Group, Object.assign({ as: Row, xs: 1, className: "group is-staff" }, { children: _jsx(Col, { children: _jsx(Form.Check, { type: "checkbox", label: "Staff View", name: "is_staff", onChange: e => handleData(e.target.name, e.target.value) }) }) })), _jsx(Row, Object.assign({ className: "form-actions" }, { children: _jsx(Button, Object.assign({ className: "submit", type: "submit" }, { children: "Submit" })) })), _jsx(Row, Object.assign({ className: "extra-link" }, { children: _jsx(Button, Object.assign({ as: "a", href: "/login" }, { children: "Login" })) }))] }))] })));
}
export default Register;
