import { externalEndpoints, internalEndpoints } from "../data/endpoints"
import { Dispatch, SetStateAction } from "react"
import { changeTokens } from "./apiUtils"
import { User } from "../App"
import { errorFormatter } from "../utils/formatUtils"
import { NavigateFunction } from "react-router-dom"
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios"

// Create axios instances

const CONTROLLER = new AbortController()
const AXIOS_BASE_CONFIG = {
  timeout: 20000,
  formSerializer: { metaTokens: false, indexes: null },
  signal: CONTROLLER.signal,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: localStorage.getItem("access")
      ? `Bearer ${localStorage.getItem("access")}`
      : "",
  },
}

export const userAPI = axios.create({
  ...AXIOS_BASE_CONFIG,
  baseURL: process.env.REACT_APP_BACKEND_USER_URL || "",
})

export const dataAPI = axios.create({
  ...AXIOS_BASE_CONFIG,
  baseURL: process.env.REACT_APP_BACKEND_DATA_URL || "",
})

interface CreateInterceptorsType {
  axiosInstance: AxiosInstance
  setLoading: Dispatch<SetStateAction<boolean>>
  setUser: Dispatch<SetStateAction<User>>
  setFeedback: Dispatch<SetStateAction<string[]>>
  navigate: NavigateFunction
}

export const IGNORE_REQUEST_INTERCEPTOR = [
  externalEndpoints.login,
  externalEndpoints.refresh,
  externalEndpoints.register,
]

export function createInterceptors({
  axiosInstance,
  setLoading,
  setUser,
  setFeedback,
  navigate,
}: CreateInterceptorsType) {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Display loading
      setLoading(true)

      if (
        !IGNORE_REQUEST_INTERCEPTOR.includes(config.url) &&
        Date.now() > Number(localStorage.getItem("expiry"))
      ) {
        // Refresh token if access token expired
        try {
          const response = await userAPI.post(externalEndpoints.refresh!, {
            refresh: localStorage.getItem("refresh"),
          })

          // Set new access tokens
          await changeTokens(response.data, setUser)
        } catch (error: any) {
          if (
            window.location.pathname !== internalEndpoints.login &&
            error?.response?.status === 401
          ) {
            navigate(internalEndpoints.logout!)
          }
        }
      }
      return config
    },
    (error: AxiosError) => {
      setLoading(false)
      Promise.reject(error)
    }
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      setFeedback([])
      setLoading(false)
      return response
    },
    (error: AxiosError) => {
      // Display error
      setFeedback(errorFormatter(error))
      setLoading(false)

      return Promise.reject(error)
    }
  )
}
