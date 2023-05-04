import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet, Navigate } from 'react-router-dom';
function PrivateRoute(props) {
    return (props.loggedIn
        ? _jsx(Outlet, {})
        : _jsx(Navigate, { to: "/login" }));
}
export default PrivateRoute;
