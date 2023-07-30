import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../App';

function PrivateRoute () {


    const {loggedIn: [loggedIn, ]} = useContext(GlobalContext);

    return (
        loggedIn
        ? <Outlet />
        : <Navigate to="/login" />
    )
}

export default PrivateRoute;