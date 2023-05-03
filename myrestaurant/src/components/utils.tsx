import endpoints from '../data/endpoints';
import axios, { AxiosResponse } from "axios";


// Methods to verify and refresh token
function verifyToken (token: string | null) {
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

function refreshToken () {
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


export function checkTokens () {
    const accessValidity = verifyToken(sessionStorage.getItem("access"));
    if (!accessValidity) {
        const refreshValidity = refreshToken();
        if (!refreshValidity) {
            return false
        }
    }
    return true
};