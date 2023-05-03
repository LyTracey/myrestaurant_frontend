import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "../style/logout.scss";
function Logout(props) {
    var navigate = useNavigate();
    var logout = function () {
        sessionStorage.removeItem("access");
        sessionStorage.setItem("loggedIn", "false");
        props.setLoggedIn(false);
    };
    useEffect(function () {
        logout();
        navigate("/");
    }, []);
    return (_jsx(Spinner, {}));
}
;
export default Logout;
