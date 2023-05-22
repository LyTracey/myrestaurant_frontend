import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext } from "react";
import { ThemeContext } from "../Base/App";
import { ReactComponent as Person } from "../../images/icons/person.svg";
import { useEffect, useState } from "react";
import endpoints from "../../data/endpoints";
import "../../styles/profile.scss";
import Form from "react-bootstrap/Form";
import { errorFormatter } from "../../utils/formatter";
import { userAPI } from "../Base/App";
function Profile(props) {
    var _a;
    var theme = useContext(ThemeContext);
    var _b = useState({
        username: "",
        is_staff: false,
        role: ""
    }), user = _b[0], setUser = _b[1];
    var _c = useState([]), APIFeedback = _c[0], setAPIFeedback = _c[1];
    var getUser = function () {
        userAPI.get("".concat(endpoints["profile"]).concat(sessionStorage.getItem("username"), "/")).then(function (response) {
            var data = response.data;
            setUser(data);
            sessionStorage.setItem("isStaff", data.is_staff.toString());
            props.setIsStaff(data.is_staff);
            props.setRole(data.role);
            sessionStorage.setItem("role", data.role);
        }).catch(function (error) {
            setAPIFeedback(errorFormatter(error));
        });
    };
    useEffect(function () { return getUser(); }, []);
    var patchUser = function (data) {
        userAPI.patch("".concat(endpoints["profile"]).concat(sessionStorage.getItem("username"), "/"), data).then(function () {
            getUser();
        }).catch(function (error) { return setAPIFeedback(errorFormatter(error)); });
    };
    return (_jsxs(Container, __assign({ className: "profile ".concat(theme) }, { children: [_jsx(Row, __assign({ className: "title" }, { children: _jsx("h2", { children: "My Profile" }) })), _jsx(Row, __assign({ className: "error" }, { children: _jsx("ul", { children: APIFeedback.map(function (item, i) { return _jsx("li", { children: item }, i); }) }) })), _jsxs(Row, __assign({ xs: 1, sm: 2 }, { children: [_jsx(Col, __assign({ className: "profile-image" }, { children: _jsx(Person, { className: "icon" }) })), _jsx(Col, { children: _jsx(Table, __assign({ className: "profile-details" }, { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Username" })), _jsx("td", { children: user.username })] }), _jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Staff" })), _jsx("td", { children: _jsx(Form.Check, { type: "checkbox", label: "Staff View", name: "is_staff", checked: user.is_staff, onChange: function (e) { return patchUser({ is_staff: e.target.checked }); } }) })] }), user.is_staff &&
                                        _jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Role" })), _jsx("td", { children: _jsxs(Form.Select, __assign({ name: "role", value: user.role, onChange: function (_a) {
                                                            var target = _a.target;
                                                            return patchUser({ role: target.value.toUpperCase() });
                                                        } }, { children: [_jsx("option", {}), _jsx("option", { children: "SALES" }), _jsx("option", { children: "MANAGER" }), _jsx("option", { children: "CHEF" })] })) })] }), user.is_staff &&
                                        _jsxs("tr", { children: [_jsx("td", __assign({ className: "key" }, { children: "Date joined" })), _jsx("td", { children: (_a = user.join_date) !== null && _a !== void 0 ? _a : "" })] })] }) })) })] }))] })));
}
;
export default Profile;
