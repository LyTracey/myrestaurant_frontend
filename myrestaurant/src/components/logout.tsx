import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "../style/logout.scss";


function Logout (props: any) {

    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem("access");
        sessionStorage.setItem("loggedIn", "false");
        props.setLoggedIn(false);
    };

    useEffect(() => {
        logout();
        navigate("/");
    }, []);

    return (
        <Spinner />
    )

};

export default Logout;