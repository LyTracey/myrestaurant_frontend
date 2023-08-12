import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import "../../../styles/logout.scss";
import { internalEndpoints } from '../../../data/endpoints';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Logout () {

    const navigate = useNavigate();

    useEffect(() => {

        // Clear all session storage
        sessionStorage.clear();

        // Redirect to login page
        navigate(internalEndpoints.login!);
    }, []);

    return (
        <Container className='page logout'>
            <Spinner animation="border">
                <span className="visually-hidden">Logging out...</span>
            </Spinner>
        </Container>
    )

};

export default Logout;