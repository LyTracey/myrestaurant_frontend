import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useContext } from "react";
import { ThemeContext } from "../Base/App";
import Placeholder from "../../images/placeholder-image.webp";
import { useEffect, useState } from "react";
import endpoints from "../../data/endpoints";
import { AxiosResponse, AxiosError } from "axios";
import "../../styles/profile.scss";

interface User {
    [key: string]: any,
    username: string,
    is_staff: boolean | null,
    join_date?: string,
    role?: string
}

function Profile(props: any) {

    const theme = useContext(ThemeContext);
    const [user, setUser] = useState<User>({
        username: "",
        is_staff: null
    });


    const getUser = () => {
        props.userAPI.get(
            `${ endpoints["profile"] }${ sessionStorage.getItem("username") }/`
        ).then((response: AxiosResponse) => setUser(response.data))
        .catch((error: AxiosError) => console.log(error));
    };

    useEffect(() => getUser(), []);

    return (
        <Container className={ `profile ${ theme }` }>
            <Row className="title">
                <h2>My Account</h2>
            </Row>

            <Row>
                <Col className="profile-image">
                    <img src={ Placeholder } />

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
                                <td>{ String(user.is_staff) }</td>
                            </tr>
                            
                            <tr>
                                <td className="key">Role</td>
                                <td>{user.role ?? ""}</td>
                            </tr>

                            <tr>
                                <td className="key">Date joined</td>
                                <td>{user.join_date ?? ""}</td>
                            </tr>

                        </tbody>
                    </Table>
                </Col>
            </Row>

        </Container>
    )
};

export default Profile;