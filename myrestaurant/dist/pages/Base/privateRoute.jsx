import { Outlet, Navigate } from 'react-router-dom';
function PrivateRoute(props) {
    return (props.loggedIn
        ? <Outlet />
        : <Navigate to="/login"/>);
}
export default PrivateRoute;
