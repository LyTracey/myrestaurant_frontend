import { externalEndpoints, internalEndpoints } from "../../../data/endpoints";
import { useContext } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { userAPI } from "../../modules/axiosInstances";
import { useForm } from "react-hook-form";
import { DisplayFeedback } from "../../modules/miscComponents";
import { ErrorMessage } from "@hookform/error-message";
import Form from "react-bootstrap/Form";
import "../../../styles/login.scss";

interface User {
    username: string,
    password1: string,
    password2: string,
    is_staff: boolean
};

const DEFAULT_REGISTERED_USER: User = {
    username: "",
    password1: "",
    password2: "",
    is_staff: false
};


function Register () {

    // Initialise form
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {...DEFAULT_REGISTERED_USER}
    });

    const { theme: [theme], feedback: [, setFeedback] } = useContext(GlobalContext);
    const navigate = useNavigate();

    //States
    const password1 = watch("password1");

    // Handle form submit
    const submitHandler = handleSubmit(async (data) => {
        
        const passwordsMatch = (data.password1 === data.password2);

        if (!passwordsMatch) {
            setFeedback(["Please ensure passwords match."]);
        } else {

            try {
                console.log({
                    username: data.username,
                    password: data.password1,
                    is_staff: data.is_staff
                });
                await userAPI.post(externalEndpoints.register!,
                    {
                        username: data.username,
                        password: data.password1,
                        is_staff: data.is_staff
                    }
                );
                navigate(internalEndpoints.registerConfirm!);
            } catch {
                return 
            }
        }
    });

    return (
        <Container className={`page register ${ theme }`}>
            <h2 className="title">Register</h2>

            <DisplayFeedback />

            <form onSubmit={ submitHandler }>
                <div className="field username">
                    <label>Username *</label>
                    <input {...register("username", {
                        required: "Please enter a username",
                    }) }/>
                    <div className="feedback">
                        <ErrorMessage errors={ errors } name="username" />
                    </div>
                </div>
                
                <div className="field password1">
                    <label>Password *</label>
                    <input 
                        type="password"
                        {...register("password1", {
                        required: "Please enter a password.",
                        pattern: {
                            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]{8,}$/,
                            message: "Must contain at least one number, one uppercase letter, one lowercase letter, and one special character."
                        },
                        minLength: {
                            value: 8,
                            message: "Must contain at least 8 characters."
                        }
                    }) }/>
                    <div className="feedback">
                        <ErrorMessage errors={ errors } name="password1" />
                    </div>
                </div>
                
                <div className="field password2">
                    <label>Re-enter Password *</label>
                    <input 
                        type="password"
                        {...register("password2", {
                            required: "Please re-enter your password.",
                            validate: (value) => value === password1 || "Must be the same as your password."
                        }) } 
                        disabled={ password1 === ""}/>
                    <div className="feedback">
                        <ErrorMessage errors={ errors } name="password2" />
                    </div>
                </div>
                
                <div className="field is-staff">
                    <label>Staff Member</label>
                    <Form.Check
                        className="check-input"
                        type="checkbox"
                        {...register("is_staff") }
                    />
                    <div className="feedback">
                        <ErrorMessage errors={ errors } name="is_staff" />
                    </div>
                </div>

                <button className="button submit" type="submit">Register</button>
            </form>

        </Container>
    )
}

export default Register;