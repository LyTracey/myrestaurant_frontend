import { userAPI, dataAPI } from "../components/App";

// Set access token and expiry date
export function changeAccessToken (accessToken: string) {

    // Set access token
    sessionStorage.setItem("access", `Bearer ${ accessToken }`);
    userAPI.defaults.headers["Authorization"] = `Bearer ${ accessToken }`;
    dataAPI.defaults.headers["Authorization"] = `Bearer ${ accessToken }`;
    
    // Set expiry of access token
    let expiry: Date = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);
    sessionStorage.setItem("expiry", String(expiry));
};