import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useState, useRef, Dispatch, FormEvent, SetStateAction } from "react";
import { externalEndpoints } from "../../../data/endpoints";
import { useContext } from 'react';
import { GlobalContext } from '../../App';
import "../../../styles/form.scss";
import { EditFieldGroup2 } from "../../modules/formComponents";
import { AxiosResponse } from "axios";
import { submitUserRequest } from "../../../utils/apiUtils";


function Login () {

    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [validated, setValidated] = useState(false);

    // Set variables
    const { theme: [theme], 
            loggedIn: [setLoggedIn], 
            user: [user, setUser],
            feedback: [feedback],
            navigate
        } = useContext(GlobalContext);

    // Handle submit to backend
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, setValidated: Dispatch<SetStateAction<boolean>>) => {

        await submitUserRequest({
            event: e,
            method: "add",
            data: {
                username: username.current!.value,
                password: password.current!.value
            },
            url: `${externalEndpoints["login"]}`,
            resolve: (response: AxiosResponse) => {

                // Set access token
                sessionStorage.setItem("access", `Bearer ${response.data.access}`);
                
                // Set expiry of access token
                let expiry: Date = new Date();
                expiry.setMinutes(expiry.getMinutes() + 15);
                sessionStorage.setItem("expiry", String(expiry));

                // Set user details in session storage
                sessionStorage.setItem("loggedIn", "true");
                sessionStorage.setItem("isStaff", response.data.isStaff);
                sessionStorage.setItem("role", response.data.role);
                
                // Set user states
                setLoggedIn(true);
                setUser({...user, role: response.data.role, isStaff: response.data.isStaff});
               
                // Redirect to profile on successful login
                navigate.current("/profile");
            },
            setValidated: setValidated
        });
    };


    return (
        <Container className={`page login-form page-form ${ theme }`}>
            <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e, setValidated)}>
                
                <h2 className="title">Login</h2>
                
                <ul className="error">
                    { feedback.map((item: string, i: number) => <li key={i}>{ item }</li>) }
                </ul>


                { EditFieldGroup2({
                    name: "username",
                    label: "Username",
                    ref: username,
                    feedback: "Please enter a username."
                }, {
                    required: true
                }) }

                
                { EditFieldGroup2({
                    name: "password",
                    label: "Password",
                    type: "password",
                    ref: password,
                    feedback: "Please enter a password."
                }, {
                    required: true
                }) } 

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