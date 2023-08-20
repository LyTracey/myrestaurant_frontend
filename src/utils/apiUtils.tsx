import { userAPI, dataAPI } from "../components/pages/App";
import { Dispatch, SetStateAction } from "react";
import jwtDecode from "jwt-decode";

interface TokenData {
    access: string,
    refresh: string
}

// Set access and refresh token
export function changeTokens (data: TokenData, userSetter: Dispatch<SetStateAction<any>> ) {
    
    // Set access token
    localStorage.setItem("access", data.access);
    userAPI.defaults.headers["Authorization"] = `Bearer ${ data.access }`;
    dataAPI.defaults.headers["Authorization"] = `Bearer ${ data.access }`;

    // Set user info
    const { isStaff, role }: any = jwtDecode(data.access);
    userSetter({
        isStaff: isStaff,
        role: role
    });


    // Set refresh token
    localStorage.setItem("refresh", data.refresh);

};