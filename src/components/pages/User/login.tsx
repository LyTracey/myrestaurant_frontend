import Container from "react-bootstrap/Container";
import { internalEndpoints, externalEndpoints } from "../../../data/endpoints";
import { useContext } from 'react';
import { GlobalContext } from '../App';
import { userAPI } from "../../modules/axiosInstances";
import { changeTokens } from "../../../utils/apiUtils";
import { NavLink, useNavigate } from "react-router-dom";
import "../../../styles/login.scss";
import { useForm } from "react-hook-form";

function Login () {

    // Create form instance
    const { register, handleSubmit } = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const navigate = useNavigate();

    // Set variables
    const { theme: [theme], user: [, setUser] } = useContext(GlobalContext);

    // Handle submit to backend
    const submitRequest = handleSubmit(async (data) => {
        const response = await userAPI.post(externalEndpoints.login!, {
            username: data.username,
            password: data.password
        });

        console.log(response);

        const tokenResponse = await changeTokens(response.data, setUser);
        console.log(tokenResponse);
        navigate(internalEndpoints.profile!);
    });


    return (
        <Container className={`page login ${ theme }`}>

            <form onSubmit={(e) => {
                e.preventDefault();
                submitRequest();
            }}>
                <label>
                    Username *
                    <input type="text" {...register("username", {required: "Please enter a username."})} />
                </label>

                <label>
                    Password *
                    <input type="password" {...register("password", {required: "Please enter a password."})} />
                </label>

                <button type="submit">Login</button>
            </form>



            <div className="link-container">
                No account?&nbsp; <NavLink className="link" to={ internalEndpoints.register! }>Register</ NavLink>
            </div>
        </Container>
    )
}

export default Login;