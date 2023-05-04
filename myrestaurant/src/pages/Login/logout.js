import { __assign } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "../../styles/logout.scss";
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
    return (_jsx(Spinner, __assign({ animation: "border" }, { children: _jsx("span", __assign({ className: "visually-hidden" }, { children: "Loading..." })) })));
}
;
export default Logout;
