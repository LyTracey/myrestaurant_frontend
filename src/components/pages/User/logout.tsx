import { useEffect, useContext } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import "../../../styles/logout.scss";
import { GlobalContext } from '../../App';


function Logout () {

    const { loggedIn: [ , setLoggedIn], user: [ , setUser], navigate } = useContext(GlobalContext);

    useEffect(() => {

        // Update session storage
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("isStaff");
        sessionStorage.removeItem("role");

        // Set state changes
        setUser({
            username: null,
            isStaff: null,
            joinDate: null,
            role: null
        });
        setLoggedIn(false);

        // Redirect to login page
        navigate.current("/login");
    }, []);

    return (
        <Spinner animation="border">
            <span className="visually-hidden">Logging out...</span>
        </Spinner>
    )

};

export default Logout;