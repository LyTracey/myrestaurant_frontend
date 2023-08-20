import { Outlet, Navigate } from 'react-router-dom';
import { internalEndpoints } from '../../data/endpoints';
import jwtDecode from 'jwt-decode';


function PrivateRoute () {
    
    const { exp }: any = jwtDecode(localStorage.getItem("access") ?? "");

    return (

        <>
            {
                (Date.now() < (exp * 1000))
                ? <Outlet />
                : <Navigate to={ internalEndpoints.login! } />
            }

            <Outlet/>
        </>

    )
}

export default PrivateRoute;