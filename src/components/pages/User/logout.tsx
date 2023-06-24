import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "../../../styles/logout.scss";


function Logout (props: any) {

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("access");
        sessionStorage.setItem("loggedIn", "false");
        props.setLoggedIn(false);
        sessionStorage.removeItem("isStaff");
        props.setIsStaff(false);
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");
        navigate("/login");
    }, []);

    return (
        <Spinner animation="border">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

};

export default Logout;