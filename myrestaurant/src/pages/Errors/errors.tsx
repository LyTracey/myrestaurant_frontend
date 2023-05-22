import "../../styles/error.scss";

export function Unauthorised () {

    return (
        <h2 className="error-message">Unauthorised 401</h2>
    )
}

export function Forbidden () {

    return (
        <h2 className="error-message">Forbidden 403</h2>
    )
}


export function NotFound () {

    return (
        <h2 className="error-message">Not Found 404</h2>
    )
}

export function InternalError () {

    return (
        <h2 className="error-message">Internal Error 500</h2>
    )
}