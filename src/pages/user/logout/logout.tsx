import { useContext, useEffect } from "react"
import Spinner from "react-bootstrap/Spinner"
import { internalEndpoints } from "../../../data/endpoints"
import { Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { GlobalContext, DEFAULT_USER } from "../../../App"
import "../../styles/login.scss"

function Logout() {
  const navigate = useNavigate()
  const {
    user: [, setUser],
  } = useContext(GlobalContext)

  useEffect(() => {
    localStorage.clear()
    setUser(DEFAULT_USER)
    navigate(internalEndpoints.login!)
  }, [navigate, setUser])

  return (
    <Container className="page logout">
      <Spinner animation="border">
        <span className="visually-hidden">Logging out...</span>
      </Spinner>
    </Container>
  )
}

export default Logout
