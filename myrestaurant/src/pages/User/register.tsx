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

interface User {
    username: string,
    password1: string,
    password2: string,
    is_staff: boolean
};


function Register (props: any) {

    // Set states
    const [newUser, setNewUser] = useState<User>({
        username: "",
        password1: "",
        password2: "",
        is_staff: false
    });
    const [validated, setValidated] = useState(false);
    const [APIFeedback, setAPIFeedback] = useState<Array<string>>([]);

    const navigate = useNavigate();

    // Handle state
    const handleData = (property: string, value: string | boolean) => {
        setNewUser({...newUser, [property]: value});
    };

    // Handle form submit
    const handleSubmit = (e: any) => {
        e.preventDefault();


        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            props.userAPI.post(
                `${endpoints["register"]}`,
                {
                    username: newUser.username,
                    password: newUser.password1,
                    is_staff: newUser.is_staff
                }
            ).then(() => {
                navigate("/");
            }).catch((error: any) => {
                setAPIFeedback(errorFormatter(error));
            });
        }
        setValidated(true);

    };

    return (
        <Container className={`register-form form ${ useContext(ThemeContext)}`}>
            <h2 className="title">Register</h2>

            <ul className="error">
                { APIFeedback.map((item, i) => <li key={i}>{ item }</li>) }
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
                            placeholder="Create password"
                            onChange={e => handleData(e.target.name, e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a password.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} xs={1} className="group password">
                    
                    <Form.Label className="left-label">Re-enter Password*</Form.Label>
                    <Col className="field">
                        <Form.Control 
                            type="password"
                            name="password2"
                            pattern={ newUser.password1 }
                            placeholder="Re-enter password"
                            onChange={e => handleData(e.target.name, e.target.value)}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please re-enter your password. Please ensure passwords match.
                        </Form.Control.Feedback>
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

            </Form>
        </Container>
    )
}

export default Register;