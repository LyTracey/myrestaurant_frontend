import "../../styles/error.scss"
import { useRouteError } from "react-router-dom"
import ICONS from "../../data/icons"
import Logout from "../../pages/user/logout/logout"

export function Unauthorized() {
  const { UnauthorizedIcon } = ICONS

  return (
    <div className="page error">
      <UnauthorizedIcon className="error-icon" />
      <h2 className="error-message">Unauthorized 401</h2>
    </div>
  )
}

function Forbidden() {
  const { ForbiddenIcon } = ICONS

  return (
    <div className="page error">
      <ForbiddenIcon className="error-icon" />
      <h2 className="error-message">Forbidden 403</h2>
    </div>
  )
}

function NotFound() {
  const { NotFoundIcon } = ICONS

  return (
    <div className="page error">
      <NotFoundIcon className="error-icon" />
      <h2 className="error-message">Not Found 404</h2>
    </div>
  )
}

function InternalError() {
  const { InternalIcon } = ICONS

  return (
    <div className="page error">
      <InternalIcon className="error-icon" />
      <h2 className="error-message">Internal Error 500</h2>
    </div>
  )
}

function Throttled() {
  const { ThrottledIcon } = ICONS

  return (
    <div className="page error">
      <ThrottledIcon className="error-icon" />
      <h2 className="error-message">
        Oh dear, you have passed the throttling levels. Please try again later.
      </h2>
    </div>
  )
}

function SomethingWentWrong() {
  const { OhNoIcon } = ICONS

  return (
    <div className="page error">
      <OhNoIcon className="error-icon" />
      <h2 className="error-message">
        Oops something went wrong. Please try again later.
      </h2>
    </div>
  )
}

// Create root error boundary
function RootErrorBoundary() {
  const error: any = useRouteError()

  console.log(error)
  const errorCode = error?.response.status ?? error.status

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
}

export default RootErrorBoundary
