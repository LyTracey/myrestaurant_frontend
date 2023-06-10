import { __awaiter } from "tslib";
import { userAPI } from "./App";
import endpoints from "../../data/endpoints";
import { PUBLIC } from "./App";
export const checkTokens = (navigationRef, setLoggedIn, location) => __awaiter(void 0, void 0, void 0, function* () {
    if (sessionStorage.getItem("access")) {
        // Check if access token exsits
        yield userAPI.post(`${endpoints["verify"]}`, { token: sessionStorage.getItem("access") }).catch(() => __awaiter(void 0, void 0, void 0, function* () {
            // If access token is invalid, try refreshing token
            yield userAPI.post(`${endpoints["refresh"]}`).then((response) => {
                // If refresh token valid, set new access token
                sessionStorage.setItem("access", response.data.access);
                sessionStorage.setItem("loggedIn", "true");
                setLoggedIn(true);
            })
                .catch(() => {
                // If refresh token invalid, remove access token and make loggedIn false
                navigationRef.current("/logout");
            });
        }));
    }
    else {
        sessionStorage.setItem("loggedIn", "false");
        setLoggedIn(false);
        if (!PUBLIC.includes(location.current.pathname)) {
            navigationRef.current("/login");
        }
    }
});
