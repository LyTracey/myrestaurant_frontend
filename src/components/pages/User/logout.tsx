import { SetStateAction, useContext, useEffect, Dispatch } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { internalEndpoints } from '../../../data/endpoints';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, DEFAULT_USER } from '../App';

const logoutClear = async (setUser: Dispatch<SetStateAction<any>>) => {

    return new Promise(function (resolve, reject) {
        // Clear all session storage
        localStorage.clear();
    
        // Reset user
        setUser(DEFAULT_USER);

        if (!localStorage.getItem("access")) {
            resolve("Success");
        } else {
            reject("Error");
        }
    })
};

function Logout () {

    const navigate = useNavigate();
    const { user: [, setUser]} = useContext(GlobalContext);

    useEffect(() => {
        
        logoutClear(setUser).then(() => 
            // Redirect to login page
            navigate(internalEndpoints.login!)
        );
    
    }, [navigate, setUser]);

    return (
        <Container className='page logout'>
            <Spinner animation="border">
                <span className="visually-hidden">Logging out...</span>
            </Spinner>
        </Container>
    )

};

export default Logout;