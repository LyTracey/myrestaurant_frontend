import { userAPI } from "../components/pages/Base/App";
import endpoints from "../data/endpoints";
import { AxiosResponse, AxiosError } from "axios";
import { PUBLIC } from "../components/pages/Base/App";
import { Location, NavigateFunction } from "react-router-dom";
import { dataAPI } from "../components/pages/Base/App";
import { Dispatch, SetStateAction } from "react";

export const checkTokens = async (
    navigationRef: React.MutableRefObject<NavigateFunction>,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    location: React.MutableRefObject<Location>
    ) => {
        if (sessionStorage.getItem("access")) {
            // Check if access token exsits
            await userAPI.post(
                `${endpoints["verify"]}`,
                {token: sessionStorage.getItem("access")}
            ).catch(async () => {
                // If access token is invalid, try refreshing token
                await userAPI.post(
                    `${endpoints["refresh"]}`,
                ).then((response: AxiosResponse) => {
                    // If refresh token valid, set new access token
                    sessionStorage.setItem("access", response.data.access);
                    sessionStorage.setItem("loggedIn", "true");
                    setLoggedIn(true);
                })
                .catch(() => {
                    // If refresh token invalid, remove access token and make loggedIn false
                    navigationRef.current("/logout");
                });
            }
            );
        } else {
            sessionStorage.setItem("loggedIn", "false");
            setLoggedIn(false);
            if (!PUBLIC.includes(location.current.pathname)) {
                navigationRef.current("/login");
            }
        }
    };


// Submit Request abstraction

const SUBMIT_ACTIONS = {
    ADD: "add",
    DELETE: "delete",
    UPDATE: "update"
};

interface SubmitObj {
    event: Event,
    method: string,
    data?: any,
    url: string,
    resolve: (...args: any) => void,
    reject:  (error: AxiosError, ...args: any) => void
};

export function submitDataRequest ({event, method, data, url, resolve, reject}: SubmitObj) {
    /*
        Function that handles delete, post, and patch requests for the dataAPI.
    */

    event.preventDefault();
    switch  (method) {
        case SUBMIT_ACTIONS.DELETE:
            return dataAPI.delete( url,
                ).then(() => resolve()
                ).catch((error: AxiosError) => reject(error));
        case SUBMIT_ACTIONS.ADD:
            return dataAPI.post( url, data
            ).then(() => resolve())
            .catch((error: AxiosError) => reject(error));
        case SUBMIT_ACTIONS.UPDATE:
            return dataAPI.patch( url, data
            ).then((response: AxiosResponse) => resolve(response))
            .catch((error: AxiosError) => reject(error));
        default:
            return "Unknown action"
    }

};


export function handleData (key: string, value: string | number, setMethod: Dispatch<SetStateAction<any>>, previousData: any) {
    setMethod({...previousData, [key]: value})
};