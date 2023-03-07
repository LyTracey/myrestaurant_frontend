import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../style/navbar.scss";

function Navigate() {

    return (
        <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>MyRestaurant</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse role="navigation">
                    <Nav.Link className="bg-primary" href="/dashboard/">Dashboard</Nav.Link>
                    <Nav.Link>Menu</Nav.Link>
                    <Nav.Link>Orders</Nav.Link>
                    <Nav.Link>Inventory</Nav.Link>
                </Navbar.Collapse>
                
            </Container>
        </Navbar>
    )
}

export default Navigate;