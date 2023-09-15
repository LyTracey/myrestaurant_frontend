import { Outlet, Navigate } from 'react-router-dom';
import { internalEndpoints } from '../../data/endpoints';
import jwtDecode from 'jwt-decode';


function PrivateRoute () {
    
    let expiry: number;

    try {
        const { exp }: any = jwtDecode(localStorage.getItem("access") ?? "");
        expiry = exp;
    } catch {
        expiry = 0
    }
    

    return (

        <>
            {
                (Date.now() < (expiry * 1000))
                ? <Outlet />
                : <Navigate to={ internalEndpoints.logout! } />
            }
        </>

    )
}

export default PrivateRoute;