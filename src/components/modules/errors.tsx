import "../../styles/error.scss";
import { useRouteError } from "react-router-dom";
import Logout from "../pages/User/logout";

function Forbidden () {

    return (
        <h2 className="error-message">Forbidden 403</h2>
    )
}


function NotFound () {

    return (
        <h2 className="error-message">Not Found 404</h2>
    )
}

function InternalError () {

    return (
        <h2 className="error-message">Internal Error 500</h2>
    )
}

function SomethingWentWrong () {

    return (
        <h2 className="error-message">Oops something went wrong. Please try again later.</h2>
    )
}


// Create root error boundary
function RootErrorBoundary () {
    const error: any = useRouteError();

    console.log(error);

    switch (error.response?.status) {
        case 401:
            return <Logout />
        case 403:
            return <Forbidden />
        case 404: 
            return <NotFound />
        case 500:
            return <InternalError />
        default:
            return <SomethingWentWrong />

    }

};

export default RootErrorBoundary;