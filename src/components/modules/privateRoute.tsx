import { Outlet, Navigate } from 'react-router-dom';
import { internalEndpoints } from '../../data/endpoints';


function PrivateRoute () {
    

    return (

        <>
            {
                (Date.now() < Number(localStorage.getItem("expiry")))
                ? <Outlet />
                : <Navigate to={ internalEndpoints.logout! } />
            }
        </>

    )
}

export default PrivateRoute;