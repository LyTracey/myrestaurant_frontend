import "../../styles/error.scss";
import { useRouteError } from "react-router-dom";
import Logout from "../pages/User/logout";
import ICONS from "../../data/icons";
import { AxiosError } from "axios";


function Forbidden () {

    return (
        <div className="page error">
            <ICONS.forbidden className="error-icon"/>
            <h2 className="error-message">Forbidden 403</h2>
        </div>
    )
}


function NotFound () {
    return (
        <div className="page error">
            <ICONS.notFound className="error-icon"/>
            <h2 className="error-message">Not Found 404</h2>
        </div>
    )
}

function InternalError () {

    return (
        <div className="page error">
            <ICONS.internal className="error-icon"/>
            <h2 className="error-message">Internal Error 500</h2>
        </div>
    )
}


function Throttled () {

    return (
        <div className="page error">
            <ICONS.throttled className="error-icon"/>
            <h2 className="error-message">Oh dear, you have passed the throttling levels. Please try again later.</h2>
        </div>
    )
}

function SomethingWentWrong () {

    return (
        <div className="page error">
            <ICONS.ohNo className="error-icon"/>
            <h2 className="error-message">Oops something went wrong. Please try again later.</h2>
        </div>
    )
}


// Create root error boundary
function RootErrorBoundary () {
    const error: any = useRouteError();

    console.log(error);
    const errorCode = error instanceof AxiosError ? error.response?.status : error.status;

    switch (errorCode) {
        case 401:
            return <Logout />
        case 403:
            return <Forbidden />
        case 404: 
            return <NotFound />
        case 429: 
            return <Throttled />
        case 500:
            return <InternalError />
        default:
            return <SomethingWentWrong />

    }

};

export default RootErrorBoundary;