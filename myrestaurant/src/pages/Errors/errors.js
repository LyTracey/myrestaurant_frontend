import { __assign } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import "../../styles/error.scss";
export function Unauthorised() {
    return (_jsx("h2", __assign({ className: "error-message" }, { children: "Unauthorised 401" })));
}
export function Forbidden() {
    return (_jsx("h2", __assign({ className: "error-message" }, { children: "Forbidden 403" })));
}
export function NotFound() {
    return (_jsx("h2", __assign({ className: "error-message" }, { children: "Not Found 404" })));
}
export function InternalError() {
    return (_jsx("h2", __assign({ className: "error-message" }, { children: "Internal Error 500" })));
}
