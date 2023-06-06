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
import { FormEvent } from "react";
import { errorFormatter } from "../../utils/formatter";
import { userAPI } from "../Base/App";
import { AxiosResponse } from "axios";

export interface LoginUser {
    username: string,
    password: string
};

function Login (props: any) {

    // Set states
    const [login, setLogin] = useState<LoginUser>({
        username: "",
        password: ""
    });
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<Array<string>>([]);

    // Set variables
    const navigationRef = useRef(useNavigate());

    // Handle state
    const handleData = (property: string, value: string | boolean) => {
        setLogin({...login, [property]: value});
    };

    // Handle form submit
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            // Post request to get jwt token
            userAPI.post(
                `${endpoints["login"]}`,
                {
                    username: login.username,
                    password: login.password,
                }
            ).then((response: AxiosResponse) => {
                sessionStorage.setItem("access", response.data.access);
                sessionStorage.setItem("isStaff", response.data.isStaff);
                props.setIsStaff(response.data.isStaff);
                sessionStorage.setItem("username", login.username);
                props.setRole(response.data.role);
                sessionStorage.setItem("role", response.data.role);
                sessionStorage.setItem("loggedIn", "true");
                props.setLoggedIn(true);
            }).catch((error: any) => {
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

    return (
        <Container className={`login-form page-form ${useContext(ThemeContext)}`}>
            <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)}>
                
                <h2 className="title">Login</h2>
                
                <ul className="error">
                    { feedback.map((item, i) => <li key={i}>{ item }</li>) }
                </ul>

                <Form.Group as={Row} xs={1} className="group username">
                    <Form.Label className="left-label">Username</Form.Label>
                    <Col className="field">
                        <Form.Control 
                            type="text" 
                            placeholder="Enter username"
                            name="username"
                            onChange={e => handleData(e.target.name, e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type='invalid'>
                            Please enter a username.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} xs={1} className="group password">
                    
                    <Form.Label className="left-label">Password</Form.Label>
                    <Col className="field">
                        <Form.Control 
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            onChange={e => handleData(e.target.name, e.target.value)}
                            required
                        />
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
        </Container>
    )
}

export default Login;