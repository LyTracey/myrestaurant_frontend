import { Outlet, Navigate } from 'react-router-dom';
import { internalEndpoints } from '../../data/endpoints';


function PrivateRoute () {
    const expiry = new Date(sessionStorage.getItem("expiry") ?? "");

    return (

        (new Date() < expiry)
        ? <Outlet />
        : <Navigate to={ internalEndpoints.login! } />
    )
}

export default PrivateRoute;