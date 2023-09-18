import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { externalEndpoints, internalEndpoints } from "../../data/endpoints";
import { Dispatch, SetStateAction } from "react";
import { changeTokens } from "../../utils/apiUtils";
import { User } from "../pages/App";
import { errorFormatter } from "../../utils/formatUtils";
import { NavigateFunction } from "react-router-dom";


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
    setFeedback: Dispatch<SetStateAction<string[]>>,
    navigate: NavigateFunction
}

const IGNORE_REQUEST_INTERCEPTOR = [externalEndpoints.login, externalEndpoints.refresh];

export function createInterceptors ({axiosInstance, setLoading, setUser, setFeedback, navigate}: CreateInterceptorsType) {
    
    // Request interceptor
    axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {

        // Display loading
        setLoading(true);

        if (!IGNORE_REQUEST_INTERCEPTOR.includes(config.url) && Date.now() > Number(localStorage.getItem("expiry"))) {
            console.log("token expired");
            // Refresh token if access token expired
            try {
                const response = await userAPI.post(externalEndpoints.refresh!, {
                    refresh: localStorage.getItem("refresh")
                });
                console.log(response);
                console.log("setting new access token");

                const changeTokensResponse = await changeTokens(response.data, setUser);
                console.log(changeTokensResponse);
            } catch (error: any) {
                
                if (window.location.pathname !== internalEndpoints.login && error?.response?.status === 401) {
                    console.log("navigating to logout");
                    navigate(internalEndpoints.logout!);
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

        Promise.reject(error)
    });
    
}