import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "../../styles/logout.scss";
function Logout(props) {
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.removeItem("access");
        sessionStorage.setItem("loggedIn", "false");
        props.setLoggedIn(false);
        sessionStorage.removeItem("isStaff");
        props.setIsStaff(false);
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");
    };
    useEffect(() => {
        logout();
        navigate("/login");
    }, []);
    return (_jsx(Spinner, Object.assign({ animation: "border" }, { children: _jsx("span", Object.assign({ className: "visually-hidden" }, { children: "Loading..." })) })));
}
;
export default Logout;
