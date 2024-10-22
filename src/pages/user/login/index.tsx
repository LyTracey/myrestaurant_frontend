import Container from "react-bootstrap/Container"
import { internalEndpoints, externalEndpoints } from "../../../data/endpoints"
import { useContext } from "react"
import { GlobalContext } from "../../../App"
import { userAPI } from "../../../api/axiosInstances"
import { changeTokens } from "../../../api/apiUtils"
import { NavLink, useNavigate } from "react-router-dom"
import "../../../styles/login.scss"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { DisplayFeedback } from "../../../components/messages/base"

export default function Login(): JSX.Element {
  // Create form instance
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const navigate = useNavigate()

  // Set variables
  const {
    theme: [theme],
    user: [, setUser],
  } = useContext(GlobalContext)

  // Handle submit to backend
  const submitRequest = handleSubmit(async (data) => {
    try {
      const response = await userAPI.post(externalEndpoints.login!, {
        username: data.username,
        password: data.password,
      })
      await changeTokens(response.data, setUser)
      navigate(internalEndpoints.profile!)
    } catch {
      return
    }
  })

  return (
    <Container className={`page login ${theme}`}>
      <h2 className="title">Login</h2>

      <DisplayFeedback />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submitRequest()
        }}
      >
        <label>Username *</label>
        <input
          type="text"
          data-testid="username-field"
          {...register("username", { required: "Please enter a username." })}
        />

        <div
          className="feedback"
          data-testid="username-feedback"
        >
          <ErrorMessage
            errors={errors}
            name="username"
          />
        </div>

        <label>Password *</label>
        <input
          type="password"
          data-testid="password-field"
          {...register("password", { required: "Please enter a password." })}
        />
        <div
          className="feedback"
          data-testid="password-feedback"
        >
          <ErrorMessage
            errors={errors}
            name="password"
          />
        </div>

        <button
          type="submit"
          className="button submit"
        >
          Login
        </button>
      </form>

      <div className="link-container">
        No account?
        <NavLink
          className="link"
          to={internalEndpoints.register!}
        >
          Register
        </NavLink>
      </div>
    </Container>
  )
}
