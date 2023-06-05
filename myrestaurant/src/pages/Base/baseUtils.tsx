import { userAPI } from "./App";
import endpoints from "../../data/endpoints";
import { AxiosResponse } from "axios";
import { PUBLIC } from "./App";
import { Location, NavigateFunction } from "react-router-dom";

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