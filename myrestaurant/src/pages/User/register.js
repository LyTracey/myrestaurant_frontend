import { __assign } from "tslib";
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
;
function Register(props) {
    // Set states
    var _a = useState({
        username: "",
        password1: "",
        password2: "",
        is_staff: false
    }), newUser = _a[0], setNewUser = _a[1];
    var _b = useState(false), validated = _b[0], setValidated = _b[1];
    var _c = useState([]), APIFeedback = _c[0], setAPIFeedback = _c[1];
    var navigate = useNavigate();
    // Handle state
    var handleData = function (property, value) {
        var _a;
        setNewUser(__assign(__assign({}, newUser), (_a = {}, _a[property] = value, _a)));
    };
    // Handle form submit
    var handleSubmit = function (e) {
        e.preventDefault();
        var passwordsMatch = (newUser.password1 === newUser.password2);
        var form = e.currentTarget;
        if (form.checkValidity() === false || !passwordsMatch) {
            e.stopPropagation();
            if (!passwordsMatch) {
                setAPIFeedback(["Please ensure passwords match."]);
            }
        }
        else {
            props.userAPI.post("".concat(endpoints["register"]), {
                username: newUser.username,
                password: newUser.password1,
                is_staff: newUser.is_staff
            }).then(function () {
                navigate("/");
            }).catch(function (error) {
                console.log(error);
                setAPIFeedback(errorFormatter(error));
            });
        }
        setValidated(true);
    };
    return (_jsxs(Container, __assign({ className: "register-form form ".concat(useContext(ThemeContext)) }, { children: [_jsx("h2", __assign({ className: "title" }, { children: "Register" })), _jsx("ul", __assign({ className: "error" }, { children: APIFeedback.map(function (item, i) { return _jsx("li", { children: item }, i); }) })), _jsxs(Form, __assign({ noValidate: true, validated: validated, className: "form", onSubmit: function (e) { return handleSubmit(e); } }, { children: [_jsxs(Form.Group, __assign({ as: Row, xs: 1, className: "group username" }, { children: [_jsx(Form.Label, __assign({ className: "left-label" }, { children: "Username*" })), _jsxs(Col, __assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "text", placeholder: "Enter username", name: "username", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true }), _jsx(Form.Control.Feedback, __assign({ type: "invalid" }, { children: "Please enter a username." }))] }))] })), _jsxs(Form.Group, __assign({ as: Row, xs: 1, className: "group password" }, { children: [_jsx(Form.Label, __assign({ className: "left-label" }, { children: "Password*" })), _jsxs(Col, __assign({ className: "field" }, { children: [_jsx(Form.Control, { type: "password", name: "password1", pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}", placeholder: "Create password", onChange: function (e) { handleData(e.target.name, e.target.value); }, required: true }), _jsx(Form.Control.Feedback, __assign({ type: "invalid" }, { children: "Required. Must contain at least one number, one uppercase letter, one lowercase letter, and at least 6 or more characters." }))] }))] })), _jsxs(Form.Group, __assign({ as: Row, xs: 1, className: "group password" }, { children: [_jsx(Form.Label, __assign({ className: "left-label" }, { children: "Re-enter Password*" })), _jsx(Col, __assign({ className: "field" }, { children: _jsx(Form.Control, { type: "password", name: "password2", placeholder: "Re-enter password", onChange: function (e) { return handleData(e.target.name, e.target.value); }, required: true }) }))] })), _jsx(Form.Group, __assign({ as: Row, xs: 1, className: "group is-staff" }, { children: _jsx(Col, { children: _jsx(Form.Check, { type: "checkbox", label: "Staff View", name: "is_staff", onChange: function (e) { return handleData(e.target.name, e.target.value); } }) }) })), _jsx(Row, __assign({ className: "form-actions" }, { children: _jsx(Button, __assign({ className: "submit", type: "submit" }, { children: "Submit" })) })), _jsx(Row, __assign({ className: "extra-link" }, { children: _jsx(Button, __assign({ as: "a", href: "/login" }, { children: "Login" })) }))] }))] })));
}
export default Register;
