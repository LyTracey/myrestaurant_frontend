import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import endpoints from '../data/endpoints';
import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";


// Method to verify token
function CheckTokens (props: any) {

    const navigationRef = useRef(useNavigate());

    const checkTokens = async () => {
        console.log("in check tokens");
        if (sessionStorage.getItem("access")) {
            // Check if access token exsits
            await props.userAPI.post(
                `${endpoints["verify"]}`,
                {token: sessionStorage.getItem("access")}
            ).catch(async () => {
                console.log("in access invalid")
                // If access token is invalid, try refreshing token
                await props.userAPI.post(
                    `${endpoints["refresh"]}`,
                ).then((response: AxiosResponse) => {
                    // If refresh token valid, set new access token
                    sessionStorage.setItem("access", response.data.access);
                    sessionStorage.setItem("loggedIn", "true");
                    console.log("in refresh valid");
                })
                .catch(() => {
                    // If refresh token invalid, remove access token and make loggedIn false
                    sessionStorage.removeItem("access");
                    sessionStorage.setItem("loggedIn", "false");
                    console.log("redirecting to login");
                    navigationRef.current("/login");
                });
            }
            );
        }
    };
    
    useEffect(() => {
        // Create a request interceptor for when 
        props.dataAPI.interceptors.request.use((config: AxiosRequestConfig) => {
            console.log("in useEffect");
            checkTokens();
            console.log("checking tokens");
            return config
        }, (error: AxiosError) => {
            return Promise.reject(error);
        }); 
         
    }, []);

    return <></>

};


export default CheckTokens;