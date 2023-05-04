import endpoints from '../data/endpoints';
import axios, { AxiosResponse } from "axios";


// Method to verify token
const verifyToken = (token: string | null): Boolean => {
    let isValid;
    axios.post(
        `${endpoints["prefix_user"]}${endpoints["verify"]}`,
        {token: token}
    ).then((response: AxiosResponse) => {
        if (response.data.detail) {
            isValid = false;
        }
    }).catch(error => console.log(error));
    return isValid ?? true
};

// Refresh token
const refreshToken = (): Boolean => {
    let isValid;
    axios.post(
        `${endpoints["prefix_user"]}${endpoints["verify"]}`,
    ).then(response => {
        if (response.data.detail) {
            isValid = false;
        } else {
            sessionStorage.setItem("access", response.data.access);
        }
    })
    .catch(error => console.log(error));
    return isValid ?? true
};


export const checkTokens = () => {
    if (!sessionStorage.getItem("access")) {
        return "No access token to verify!"
    }

    const accessValidity = verifyToken(sessionStorage.getItem("access"));
    if (!accessValidity) {
        const refreshValidity = refreshToken();
        if (!refreshValidity) {
            return false
        }
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${ sessionStorage.getItem("access") }`;
    return true
};