import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useRef } from "react";
import { internalEndpoints, externalEndpoints } from "../../../data/endpoints";
import { useContext } from 'react';
import { GlobalContext } from '../App';
import { EditFieldGroup2 } from "../../modules/formComponents";
import { AxiosResponse } from "axios";
import { userAPI } from "../App";
import { FormTemplate } from "../../modules/forms";
import { changeTokens } from "../../../utils/apiUtils";


function Login () {

    // Field states
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    // Set variables
    const { theme: [theme], user: [, setUser] } = useContext(GlobalContext);

    // Handle submit to backend
    const submitRequest = async () => {
        return userAPI.post(externalEndpoints.login!, {
            username: username.current!.value,
            password: password.current!.value,
        }).then((response: AxiosResponse) => {
            changeTokens(response.data, setUser);
        });
    };

    const Fields = () => {
        return (
            <>
                { 
                    EditFieldGroup2({
                        name: "username",
                        label: "Username",
                        ref: username,
                        feedback: "Please enter a username."
                    }, {
                        required: true
                    }) 
                }

                
                { EditFieldGroup2({
                    name: "password",
                    label: "Password",
                    type: "password",
                    ref: password,
                    feedback: "Please enter a password."
                }, {
                    required: true
                }) } 
            </>
        )
    };


    return (
        <Container className={`page page-form login ${ theme }`}>

            <FormTemplate
                title="Login"
                Fields={ Fields }
                submitRequest={ submitRequest }
                redirectURL={ internalEndpoints.profile! }
                buttonText="Login"             
            />

            <Row className="extra-link">
                <Button as="a" href="/register">Register</Button>
            </Row>
        </Container>
    )
}

export default Login;