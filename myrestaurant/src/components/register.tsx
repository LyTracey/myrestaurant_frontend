import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import endpoints from "../data/endpoints";
import { useState } from "react";
import { User } from "../types/userTypes";
import "../style/register.scss";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from './contexts';

function Register () {

    // Set states
    const [newUser, setNewUser] = useState<User>({
        email: "",
        password1: "",
        password2: "",
        is_staff: false
    });

    const navigate = useNavigate();

    // Handle state
    const handleData = (property: string, value: string | boolean) => {
        setNewUser({...newUser, [property]: value});
    };

    // Handle form submit
    const handleSubmit = (e: any) => {
        e.preventDefault();

        // Check if passwords match
        if (newUser.password1 !== newUser.password2) {
            return "Passwords do not match."
        }

        // Post request to create new user
        axios.post(
            `${endpoints["prefix_user"]}${endpoints["register"]}`,
            {
                email: newUser.email,
                password: newUser.password1,
                is_staff: newUser.is_staff
            }
        ).then(() => {
            navigate("/");
        }).catch(error => console.log(error));

        return "User created."

    };

    return (
        <Container className={`register ${ useContext(ThemeContext)}`} fluid>
            <h2 className="title">Register</h2>

            <Form className="form" onSubmit={e => handleSubmit(e)}>
                <Form.Group className="group email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        name="email"
                        onChange={e => handleData(e.target.name, e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="group password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password" 
                        name="password1"
                        placeholder="Create password"
                        onChange={e => handleData(e.target.name, e.target.value)}
                        required
                    />

                </Form.Group>
                
                <Form.Group className="group password">
                    
                    <Form.Label>Re-enter Password</Form.Label>
                    <Form.Control 
                        type="password"
                        name="password2"
                        pattern={newUser.password1}
                        placeholder="Re-enter password"
                        title="Passwords do not match."
                        onChange={e => handleData(e.target.name, e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="group is-staff">
                    <Form.Check 
                        type="checkbox" 
                        label="Staff View"
                        name="is_staff"
                        onChange={e => handleData(e.target.name, e.target.value)}
                    />
                </Form.Group>
                
                <Row className="submit">
                    <Button className="submit-button" type="submit">Submit</Button>
                </Row>

            </Form>
        </Container>
    )
}

export default Register;