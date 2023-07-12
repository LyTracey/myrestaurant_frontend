import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useState, useRef, Dispatch, FormEvent, SetStateAction } from "react";
import endpoints from "../../../data/endpoints";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { useNavigate } from 'react-router-dom';
import "../../../styles/form.scss";
import { errorFormatter } from "../../../utils/formatter";
import { EditFieldGroup2 } from "../../modules/formComponents";
import { AxiosResponse, AxiosError } from "axios";
import { submitUserRequest } from "../../../utils/baseUtils";
import { userAPI, dataAPI } from "../Base/App";


function Login (props: any) {

    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [validated, setValidated] = useState(false);
    const [feedback, setFeedback] = useState<Array<string>>([]);

    // Set variables
    const navigate = useRef(useNavigate());

    // Handle submit to backend
    const handleSubmit = async (e: FormEvent<HTMLFormElement>, setValidated: Dispatch<SetStateAction<boolean>>) => {

        await submitUserRequest({
            event: e,
            method: "add",
            data: {
                username: username.current!.value,
                password: password.current!.value
            },
            url: `${endpoints["login"]}`,
            resolve: (response: AxiosResponse) => {

                // Set access token
                sessionStorage.setItem("access", `Bearer ${response.data.access}`);
                userAPI.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
                dataAPI.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;

                // Set expiry of access token
                let expiry: Date = new Date();
                expiry.setMinutes(expiry.getMinutes() + 15);
                sessionStorage.setItem("expiry", String(expiry));

                sessionStorage.setItem("isStaff", response.data.isStaff);
                sessionStorage.setItem("username", username.current!.value);

                props.setRole(response.data.role);
                sessionStorage.setItem("role", response.data.role);
                sessionStorage.setItem("loggedIn", "true");
                props.setLoggedIn(true);
                

                navigate.current("/profile");
            },
            reject: (error: AxiosError) => {
                console.log(error);
                setFeedback(errorFormatter(error));
            },
            setValidated: setValidated
        });
    };


    return (
        <Container className={`page login-form page-form ${useContext(ThemeContext)}`}>
            <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e, setValidated)}>
                
                <h2 className="title">Login</h2>
                
                <ul className="error">
                    { feedback.map((item, i) => <li key={i}>{ item }</li>) }
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