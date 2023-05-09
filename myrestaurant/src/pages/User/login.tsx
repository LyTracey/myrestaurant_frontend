import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import endpoints from "../../data/endpoints";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { useNavigate } from 'react-router-dom';
import "../../styles/register.scss";
import { AxiosError } from "axios";

export interface LoginUser {
    username: string,
    password: string
};

function Login (props: any) {
    // Set state
    const [login, setLogin] = useState<LoginUser>({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    // Handle state
    const handleData = (property: string, value: string | boolean) => {
        setLogin({...login, [property]: value});
    };

    // Handle form submit
    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Post request to get jwt token
        props.userAPI.post(
            `${endpoints["login"]}`,
            {
                username: login.username,
                password: login.password,
            }
        ).then((response: any) => {
            sessionStorage.setItem("access", response.data.access);
            sessionStorage.setItem("loggedIn", "true");
            props.setLoggedIn(true);
            sessionStorage.setItem("isStaff", response.data.isStaff);
            props.setIsStaff(response.data.isStaff);
            sessionStorage.setItem("username", login.username);
            navigate("/profile");
        }).catch((error: AxiosError) => console.log(error));
    };

    return (
        <Container className={`login ${useContext(ThemeContext)}`} fluid>
            <Form onSubmit={e => handleSubmit(e)}>
                <h2 className="title">Login</h2>

                <Form.Group className="group username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter username"
                        name="username"
                        onChange={e => handleData(e.target.name, e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="group password">
                    
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        onChange={e => handleData(e.target.name, e.target.value)}
                        required
                    />
                </Form.Group>

                <Row className="submit">
                    <Button className="submit-button" type="submit">Submit</Button>
                </Row>
            </Form>

            <Row className="register-link">
                <Button as="a" href="/register">Register</Button>
            </Row>
        </Container>
    )
}

export default Login;