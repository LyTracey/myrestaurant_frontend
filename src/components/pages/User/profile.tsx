import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext, ChangeEvent, SetStateAction, Dispatch } from "react";
import {ReactComponent as Person} from "../../../images/icons/person.svg";
import { externalEndpoints } from "../../../data/endpoints";
import { AxiosResponse } from "axios";
import "../../../styles/profile.scss";
import Form from "react-bootstrap/Form";
import { errorFormatter } from "../../../utils/formatUtils";
import { userAPI, GlobalContext } from "../../App";
import { User } from "../../App";

export function fetchData (setUser: Dispatch<SetStateAction<User>>, setFeedback: Dispatch<SetStateAction<Array<string>>>) {
    userAPI.get(
        `${ externalEndpoints["profile"] }${ sessionStorage.getItem("username") }/`,
    ).then((response: AxiosResponse) => {
        // Update user state
        setUser(response.data);
        
        // Update user details in session stroage
        sessionStorage.setItem("isStaff", response.data.is_staff.toString());
        sessionStorage.setItem("role", response.data.role!);
        
    }).catch((error: any) => {
        setFeedback(errorFormatter(error));
        console.log(error);
    })
};

function Profile () {

    const { theme: [theme], user: [user, setUser], feedback: [setFeedback]  } = useContext(GlobalContext);

    // Handle PATCH request
    const patchUser = (data: object) => {
        userAPI.patch(
            `${ externalEndpoints["profile"] }${ user.username }/`,
            data
        ).then(() => fetchData(setUser, setFeedback) )
        .catch((error: any) => setFeedback(errorFormatter(error)));
    };

    return (
        <Container className={ `page profile ${ theme }` }>
            <Row className="title">
                <h2>My Profile</h2>
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
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => patchUser({is_staff: e.target.checked})}
                                    />
                                </td>
                            </tr>
                            
                            {   user.is_staff &&
                                <tr>
                                    <td className="key">Role</td>
                                    <td>
                                        <Form.Select name="role" value={ user.role } onChange={({target}) => patchUser({role: target.value.toUpperCase()})}>
                                            <option></option>
                                            <option>SALES</option>
                                            <option>MANAGER</option>
                                            <option>CHEF</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            }

                            {
                                user.is_staff &&
                                <tr>
                                    <td className="key">Date joined</td>
                                    <td>{user.join_date ?? ""}</td>
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