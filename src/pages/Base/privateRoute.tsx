import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoute (props: any) {

    return (
        props.loggedIn
        ? <Outlet />
        : <Navigate to="/login" />
    )
}

export default PrivateRoute;