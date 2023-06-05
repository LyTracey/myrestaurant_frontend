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
    const theme = useContext(ThemeContext);
    const [user, setUser] = useState({
        username: "",
        is_staff: false,
        role: ""
    });
    const [APIFeedback, setAPIFeedback] = useState([]);
    const getUser = () => {
        userAPI.get(`${endpoints["profile"]}${sessionStorage.getItem("username")}/`).then((response) => {
            const data = response.data;
            setUser(data);
            sessionStorage.setItem("isStaff", data.is_staff.toString());
            props.setIsStaff(data.is_staff);
            props.setRole(data.role);
            sessionStorage.setItem("role", data.role);
        }).catch((error) => {
            setAPIFeedback(errorFormatter(error));
        });
    };
    useEffect(() => getUser(), []);
    const patchUser = (data) => {
        userAPI.patch(`${endpoints["profile"]}${sessionStorage.getItem("username")}/`, data).then(() => {
            getUser();
        }).catch((error) => setAPIFeedback(errorFormatter(error)));
    };
    return (<Container className={`profile ${theme}`}>
            <Row className="title">
                <h2>My Profile</h2>
            </Row>

            <Row className="error">
                <ul>
                    {APIFeedback.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </Row>

            <Row xs={1} sm={2}>
                <Col className="profile-image">
                    <Person className="icon"/>
                </Col>
                
                <Col>
                    <Table className="profile-details">
                        <tbody>
                            <tr>
                                <td className="key">Username</td>
                                <td>{user.username}</td>
                            </tr>

                            <tr>
                                <td className="key">Staff</td>
                                <td>
                                    <Form.Check type="checkbox" label="Staff View" name="is_staff" checked={user.is_staff} onChange={(e) => patchUser({ is_staff: e.target.checked })}/>
                                </td>
                            </tr>
                            
                            {user.is_staff &&
            <tr>
                                    <td className="key">Role</td>
                                    <td>
                                        <Form.Select name="role" value={user.role} onChange={({ target }) => patchUser({ role: target.value.toUpperCase() })}>
                                            <option></option>
                                            <option>SALES</option>
                                            <option>MANAGER</option>
                                            <option>CHEF</option>
                                        </Form.Select>
                                    </td>
                                </tr>}

                            {user.is_staff &&
            <tr>
                                    <td className="key">Date joined</td>
                                    <td>{(_a = user.join_date) !== null && _a !== void 0 ? _a : ""}</td>
                                </tr>}

                        </tbody>
                    </Table>
                </Col>
            </Row>

        </Container>);
}
;
export default Profile;
