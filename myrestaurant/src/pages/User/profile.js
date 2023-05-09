import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext } from "react";
import { ThemeContext } from "../Base/App";
import Placeholder from "../../images/placeholder-image.webp";
import { useEffect, useState } from "react";
import endpoints from "../../data/endpoints";
import "../../styles/profile.scss";
function Profile(props) {
    var _a, _b;
    var theme = useContext(ThemeContext);
    var _c = useState({
        username: "",
        is_staff: null
    }), user = _c[0], setUser = _c[1];
    var getUser = function () {
        props.userAPI.get("".concat(endpoints["profile"]).concat(sessionStorage.getItem("username"), "/")).then(function (response) { return setUser(response.data); })
            .catch(function (error) { return console.log(error); });
    };
    useEffect(function () { return getUser(); }, []);
    return (_jsxs(Container, __assign({ className: "profile ".concat(theme) }, { children: [_jsx(Row, __assign({ className: "title" }, { children: _jsx("h2", { children: "My Account" }) })), _jsxs(Row, { children: [_jsx(Col, __assign({ className: "profile-image" }, { children: _jsx("img", { src: Placeholder }) })), _jsx(Col, { children: _jsx(Table, __assign({ className: "profile-details" }, { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Username" })), _jsx("td", { children: user.username })] }), _jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Staff" })), _jsx("td", { children: user.is_staff })] }), _jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Role" })), _jsx("td", { children: (_a = user.role) !== null && _a !== void 0 ? _a : "" })] }), _jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Date joined" })), _jsx("td", { children: (_b = user.join_date) !== null && _b !== void 0 ? _b : "" })] })] }) })) })] })] })));
}
;
export default Profile;
