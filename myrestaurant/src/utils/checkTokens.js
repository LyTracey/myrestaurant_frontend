import { __awaiter, __generator } from "tslib";
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import endpoints from '../data/endpoints';
// Method to verify token
function CheckTokens(props) {
    var _this = this;
    var navigationRef = useRef(useNavigate());
    var checkTokens = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("in check tokens");
                    if (!sessionStorage.getItem("access")) return [3 /*break*/, 2];
                    // Check if access token exsits
                    return [4 /*yield*/, props.userAPI.post("".concat(endpoints["verify"]), { token: sessionStorage.getItem("access") }).catch(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("in access invalid");
                                        // If access token is invalid, try refreshing token
                                        return [4 /*yield*/, props.userAPI.post("".concat(endpoints["refresh"])).then(function (response) {
                                                // If refresh token valid, set new access token
                                                sessionStorage.setItem("access", response.data.access);
                                                sessionStorage.setItem("loggedIn", "true");
                                                console.log("in refresh valid");
                                            })
                                                .catch(function () {
                                                // If refresh token invalid, remove access token and make loggedIn false
                                                sessionStorage.removeItem("access");
                                                sessionStorage.setItem("loggedIn", "false");
                                                console.log("redirecting to login");
                                                navigationRef.current("/login");
                                            })];
                                    case 1:
                                        // If access token is invalid, try refreshing token
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // Check if access token exsits
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        // Create a request interceptor for when 
        props.dataAPI.interceptors.request.use(function (config) {
            console.log("in useEffect");
            checkTokens();
            console.log("checking tokens");
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
    }, []);
    return _jsx(_Fragment, {});
}
;
export default CheckTokens;
