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
    const [login, setLogin] = useState({
        username: "",
        password: ""
    });
    const [validated, setValidated] = useState(false);
    const [APIFeedback, setAPIFeedback] = useState([]);
    // Set variables
    const navigate = useNavigate();
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
                console.log(error);
                setAPIFeedback(errorFormatter(error));
            }).finally(() => {
                var _a;
                if ((_a = sessionStorage.getItem("loggedIn")) !== null && _a !== void 0 ? _a : false) {
                    navigate("/profile");
                    window.location.reload();
                }
            });
        }
        setValidated(true);
    };
    return (<Container className={`login-form form ${useContext(ThemeContext)}`}>
            <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>
                
                <h2 className="title">Login</h2>
                
                <ul className="error">
                    {APIFeedback.map((item, i) => <li key={i}>{item}</li>)}
                </ul>

                <Form.Group as={Row} xs={1} className="group username">
                    <Form.Label className="left-label">Username</Form.Label>
                    <Col className="field">
                        <Form.Control type="text" placeholder="Enter username" name="username" onChange={e => handleData(e.target.name, e.target.value)} required/>
                        <Form.Control.Feedback type='invalid'>
                            Please enter a username.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} xs={1} className="group password">
                    
                    <Form.Label className="left-label">Password</Form.Label>
                    <Col className="field">
                        <Form.Control type="password" name="password" placeholder="Enter password" onChange={e => handleData(e.target.name, e.target.value)} required/>
                        <Form.Control.Feedback type='invalid'>
                            Please enter a password.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Row className="form-actions">
                    <Button className="submit" type="submit">Submit</Button>
                </Row>
            </Form>

            <Row className="extra-link">
                <Button as="a" href="/register">Register</Button>
            </Row>
        </Container>);
}
export default Login;
