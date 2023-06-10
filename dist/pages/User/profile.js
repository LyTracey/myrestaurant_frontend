import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext, useRef } from "react";
import { ThemeContext } from "../Base/App";
import { ReactComponent as Person } from "../../images/icons/person.svg";
import { useEffect, useState } from "react";
import endpoints from "../../data/endpoints";
import "../../styles/profile.scss";
import Form from "react-bootstrap/Form";
import { errorFormatter } from "../../utils/formatter";
import { userAPI, HEADERS } from "../Base/App";
import { checkTokens } from "../Base/baseUtils";
import { useNavigate, useLocation } from "react-router-dom";
function Profile(props) {
    var _a;
    const theme = useContext(ThemeContext);
    const [user, setUser] = useState({
        username: "",
        is_staff: false,
        role: ""
    });
    const [feedback, setFeedback] = useState([]);
    const location = useRef(useLocation());
    const navigationRef = useRef(useNavigate());
    const getUser = () => {
        userAPI.get(`${endpoints["profile"]}${sessionStorage.getItem("username")}/`, { headers: HEADERS }).then((response) => {
            const data = response.data;
            setUser(data);
            sessionStorage.setItem("isStaff", data.is_staff.toString());
            props.setIsStaff(data.is_staff);
            props.setRole(data.role);
            sessionStorage.setItem("role", data.role);
        }).catch((error) => {
            setFeedback(errorFormatter(error));
        });
    };
    useEffect(() => getUser(), []);
    const patchUser = (data) => {
        checkTokens(navigationRef, props.setLoggedIn, location);
        userAPI.patch(`${endpoints["profile"]}${sessionStorage.getItem("username")}/`, data, { headers: HEADERS }).then(() => {
            getUser();
        }).catch((error) => setFeedback(errorFormatter(error)));
    };
    return (_jsxs(Container, Object.assign({ className: `profile ${theme}` }, { children: [_jsx(Row, Object.assign({ className: "title" }, { children: _jsx("h2", { children: "My Profile" }) })), _jsx(Row, Object.assign({ className: "error" }, { children: _jsx("ul", { children: feedback.map((item, i) => _jsx("li", { children: item }, i)) }) })), _jsxs(Row, Object.assign({ xs: 1, sm: 2 }, { children: [_jsx(Col, Object.assign({ className: "profile-image" }, { children: _jsx(Person, { className: "icon" }) })), _jsx(Col, { children: _jsx(Table, Object.assign({ className: "profile-details" }, { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("td", Object.assign({ className: "key" }, { children: "Username" })), _jsx("td", { children: user.username })] }), _jsxs("tr", { children: [_jsx("td", Object.assign({ className: "key" }, { children: "Staff" })), _jsx("td", { children: _jsx(Form.Check, { type: "checkbox", label: "Staff View", name: "is_staff", checked: user.is_staff, onChange: (e) => patchUser({ is_staff: e.target.checked }) }) })] }), user.is_staff &&
                                        _jsxs("tr", { children: [_jsx("td", Object.assign({ className: "key" }, { children: "Role" })), _jsx("td", { children: _jsxs(Form.Select, Object.assign({ name: "role", value: user.role, onChange: ({ target }) => patchUser({ role: target.value.toUpperCase() }) }, { children: [_jsx("option", {}), _jsx("option", { children: "SALES" }), _jsx("option", { children: "MANAGER" }), _jsx("option", { children: "CHEF" })] })) })] }), user.is_staff &&
                                        _jsxs("tr", { children: [_jsx("td", Object.assign({ className: "key" }, { children: "Date joined" })), _jsx("td", { children: (_a = user.join_date) !== null && _a !== void 0 ? _a : "" })] })] }) })) })] }))] })));
}
;
export default Profile;
