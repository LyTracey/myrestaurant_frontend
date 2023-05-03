import endpoints from '../data/endpoints';
import axios from "axios";
// Methods to verify and refresh token
function verifyToken(token) {
    var isValid;
    axios.post("".concat(endpoints["prefix_user"]).concat(endpoints["verify"]), { token: token }).then(function (response) {
        if (response.data.detail) {
            isValid = false;
        }
    }).catch(function (error) { return console.log(error); });
    return isValid !== null && isValid !== void 0 ? isValid : true;
}
;
function refreshToken() {
    var isValid;
    axios.post("".concat(endpoints["prefix_user"]).concat(endpoints["verify"])).then(function (response) {
        if (response.data.detail) {
            isValid = false;
        }
        else {
            sessionStorage.setItem("access", response.data.access);
        }
    })
        .catch(function (error) { return console.log(error); });
    return isValid !== null && isValid !== void 0 ? isValid : true;
}
;
export function checkTokens() {
    var accessValidity = verifyToken(sessionStorage.getItem("access"));
    if (!accessValidity) {
        var refreshValidity = refreshToken();
        if (!refreshValidity) {
            return false;
        }
    }
    return true;
}
;
