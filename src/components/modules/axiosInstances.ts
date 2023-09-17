import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { externalEndpoints, internalEndpoints } from "../../data/endpoints";
import { Dispatch, SetStateAction } from "react";
import jwtDecode from "jwt-decode";
import { changeTokens } from "../../utils/apiUtils";
import { NavigateFunction } from "react-router-dom";
import { User } from "../pages/App";
import { errorFormatter } from "../../utils/formatUtils";


// Create axios instances

const CONTROLLER = new AbortController();
const AXIOS_BASE_CONFIG  = {
    timeout: 20000,
    formSerializer: { metaTokens: false, indexes: null },
    signal: CONTROLLER.signal,
    headers: {    
        "Content-Type": 'multipart/form-data',
        "Authorization": localStorage.getItem("access") ? `Bearer ${localStorage.getItem("access")}` : ""
    }
};

export const userAPI = axios.create({
    ...AXIOS_BASE_CONFIG,
    baseURL: `${ externalEndpoints.prefix_user}`,
});

export const dataAPI = axios.create({
    ...AXIOS_BASE_CONFIG,
    baseURL: `${externalEndpoints.prefix_data}`,
});

interface CreateInterceptorsType {
    axiosInstance: AxiosInstance, 
    setLoading: Dispatch<SetStateAction<boolean>>,
    setUser: Dispatch<SetStateAction<User>>,
    setFeedback: Dispatch<SetStateAction<string[]>>
    navigate: NavigateFunction,
}

export function createInterceptors ({axiosInstance, setLoading, setUser, setFeedback, navigate}: CreateInterceptorsType) {
    
    // Request interceptor
    axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {

        // Display loading
        setLoading(true);
        if (localStorage.getItem("access") && config.url !== externalEndpoints.refresh ) {

            // Get expiry time
            const { exp }: any = jwtDecode(localStorage.getItem("access") ?? "");


            if (Date.now() > (exp * 1000)) {

                // Try refreshing token if access token expired

                try {
                    const refreshToken = localStorage.getItem("refresh");
                    console.log(refreshToken);
                    const response = await userAPI.post(externalEndpoints.refresh!, {
                        refresh: refreshToken
                    });
                    console.log(response);
                    console.log("setting new access token");

                    const changeTokensResponse = await changeTokens(response.data, setUser);
                    console.log(changeTokensResponse);
                } catch (error) {
                    console.log(error);
                } 
            }
        }
        return config
    }, (error: AxiosError) => {
        console.log(error);
        setLoading(false);
        Promise.reject(error)
    });

    // Response interceptor
    axiosInstance.interceptors.response.use((response: AxiosResponse) => {
        setFeedback([]);
        setLoading(false);
        return response
    }, (error: AxiosError) => {
        // Display error
        setFeedback(errorFormatter(error));
        setLoading(false);

        // Redirect to login if unauthrorized
        if (window.location.pathname !== internalEndpoints.login && error.response?.status === 401) {
            console.log("navigating to logout");
            navigate(internalEndpoints.logout!);
        }

        Promise.reject(error)
    });
    
}