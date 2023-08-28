import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext, useEffect } from "react";
import {ReactComponent as Person} from "../../../images/icons/person.svg";
import { externalEndpoints } from "../../../data/endpoints";
import "../../../styles/profile.scss";
import Form from "react-bootstrap/Form";
import { GlobalContext } from "../App";
import { userAPI } from "../App";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

interface UserType {
    username: string,
    isStaff: boolean,
    joinDate: string,
    role: string
};

function Profile () {

    const user = useLoaderData() as UserType;

    // Utils
    const { theme: [theme], feedback: [feedback], user: [, setUser] } = useContext(GlobalContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => setUser(user), [user]);


    // Handle PATCH request
    const patchUser = async (data: object) => {
        await userAPI.patch(`${ externalEndpoints.profile! }${ user.username }/`, data);
        navigate(pathname);
    };

    return (
        <Container className={ `page profile ${ theme }` }>
            
            <h2 className="title">My Profile</h2>

            <Row>
                <ul className="error">
                    { feedback.map((item: any, i: any) => <li key={i}>{ item }</li>) }
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
                                    <Form.Check 
                                        type="checkbox"
                                        label="Staff View"
                                        name="is_staff"
                                        checked={ user.isStaff }
                                        onChange={({ target }) => {
                                            patchUser({is_staff: target.checked});
                                        }}
                                    />
                                </td>
                            </tr>
                            
                            {   user.isStaff &&
                                <tr>
                                    <td className="key">Role</td>
                                    <td>
                                        <Form.Select name="role" value={ user.role } onChange={({target}) => {
                                            patchUser({role: target.value});
                                        }}>
                                            <option></option>
                                            <option>SALES</option>
                                            <option>MANAGER</option>
                                            <option>CHEF</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            }

                            {
                                user.isStaff &&
                                <tr>
                                    <td className="key">Date joined</td>
                                    <td>{user.joinDate ?? ""}</td>
                                </tr>
                            }

                        </tbody>
                    </Table>
                </Col>
            </Row>

        </Container>
    )
};

export default Profile;