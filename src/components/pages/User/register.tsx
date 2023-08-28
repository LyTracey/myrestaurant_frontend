import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { externalEndpoints } from "../../../data/endpoints";
import { FormEvent, useState, useContext } from "react";
import "../../../styles/form.scss";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { userAPI } from "../App";

interface User {
    username: string,
    password1: string,
    password2: string,
    is_staff: boolean
};


function Register () {

    // Set states
    const [newUser, setNewUser] = useState<User>({
        username: "",
        password1: "",
        password2: "",
        is_staff: false
    });
    const [validated, setValidated] = useState(false);
    const { theme: [theme], feedback: [feedback, setFeedback] } = useContext(GlobalContext);
    const navigate = useNavigate();

    // Handle state
    const handleData = (property: string, value: string | boolean) => {
        setNewUser({...newUser, [property]: value});
    };

    // Handle form submit
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const passwordsMatch = (newUser.password1 === newUser.password2);


        const form = e.currentTarget;
        if (form.checkValidity() === false || !passwordsMatch) {
            e.stopPropagation();
            if (!passwordsMatch) {
                setFeedback(["Please ensure passwords match."]);
            }
        } else {
            userAPI.post(
                `${externalEndpoints["register"]}`,
                {
                    username: newUser.username,
                    password: newUser.password1,
                    is_staff: newUser.is_staff
                }
            ).then(() => {
                navigate("/");
            })
        }
        setValidated(true);

    };

    return (
        <Container className={`page register-form page-form ${ theme }`}>
            <h2 className="title">Register</h2>

            <ul className="error">
                { feedback.map((item: string, i: number) => <li key={i}>{ item }</li>) }
            </ul>


            <Form noValidate validated={ validated } className="form" onSubmit={e => handleSubmit(e)}>
                
                <Form.Group as={Row} xs={1} className="group username">
                    <Form.Label className="left-label">Username*</Form.Label>
                    <Col className="field">
                        <Form.Control 
                            type="text" 
                            placeholder="Enter username"
                            name="username"
                            onChange={e => handleData(e.target.name, e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a username.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} xs={1} className="group password">
                    <Form.Label className="left-label">Password*</Form.Label>
                    <Col className="field">
                        <Form.Control
                            type="password" 
                            name="password1"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                            placeholder="Create password"
                            onChange={e => { handleData(e.target.name, e.target.value) }}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Required. Must contain at least one number, one uppercase letter, one lowercase letter, and at least 6 or more characters.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} xs={1} className="group password">
                    
                    <Form.Label className="left-label">Re-enter Password*</Form.Label>
                    <Col className="field">
                        <Form.Control 
                            type="password"
                            name="password2"
                            placeholder="Re-enter password"
                            onChange={e => handleData(e.target.name, e.target.value) }
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} xs={1} className="group is-staff">
                    <Col>
                        <Form.Check 
                            type="checkbox" 
                            label="Staff View"
                            name="is_staff"
                            onChange={e => handleData(e.target.name, e.target.value)}
                        />
                    </Col>
                </Form.Group>
                
                <Row className="form-actions">
                    <Button className="submit" type="submit">Submit</Button>
                </Row>

                <Row className="extra-link">
                    <Button as="a" href="/login">Login</Button>
                </Row>

            </Form>
        </Container>
    )
}

export default Register;