import endpoints from '../data/endpoints';
import axios from "axios";
// Method to verify token
var verifyToken = function (token) {
    var isValid;
    axios.post("".concat(endpoints["prefix_user"]).concat(endpoints["verify"]), { token: token }).then(function (response) {
        if (response.data.detail) {
            isValid = false;
        }
    }).catch(function (error) { return console.log(error); });
    return isValid !== null && isValid !== void 0 ? isValid : true;
};
// Refresh token
var refreshToken = function () {
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
};
export var checkTokens = function () {
    if (!sessionStorage.getItem("access")) {
        return "No access token to verify!";
    }
    var accessValidity = verifyToken(sessionStorage.getItem("access"));
    if (!accessValidity) {
        var refreshValidity = refreshToken();
        if (!refreshValidity) {
            return false;
        }
    }
    axios.defaults.headers.common['Authorization'] = "Bearer ".concat(sessionStorage.getItem("access"));
    return true;
};
