import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../style/navbar.scss";
import Form from 'react-bootstrap/Form';

function Navigate(props: any) {

    const handleTheme = ({ target }: any) => {
        target.checked ? props.setTheme("dark-mode") : props.setTheme("light-mode")
    };

    return (
        <Navbar className={ props.theme } collapseOnSelect sticky="top" expand="lg">
            <Container>
                <Navbar.Brand className={ props.theme }>MyRestaurant</Navbar.Brand>
                <Navbar.Toggle className={ props.theme } aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse role="navigation">
                    <Nav.Link  href="/dashboard/">Dashboard</Nav.Link>
                    <Nav.Link >Menu</Nav.Link>
                    <Nav.Link >Orders</Nav.Link>
                    <Nav.Link >Inventory</Nav.Link>
                    <Form>
                        <Form.Check className={ `${ props.theme }-reversed` } id="theme-btn" type="switch" checked={ props.theme === "light-mode" ? false : true} onChange={(e) => handleTheme(e) } ></Form.Check>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigate;