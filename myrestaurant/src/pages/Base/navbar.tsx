import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import "../../styles/navbar.scss";
import { ReactComponent as SunIcon } from '../../images/icons/sun.svg';
import { ReactComponent as MoonIcon } from '../../images/icons/moon.svg';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Logo } from "../../images/moonlight-logo.svg";
import { useContext } from 'react';
import { ThemeContext } from './App';

function Navigate(props: any) {

    const handleTheme = () => {
        if (localStorage.getItem("theme") === "light-mode"){
            props.setTheme("dark-mode");
            localStorage.setItem("theme", "dark-mode");
        } else {
            props.setTheme("light-mode");
            localStorage.setItem("theme", "light-mode");
        }
    };

    return (
        <Navbar className={ useContext(ThemeContext) } collapseOnSelect sticky="top" expand="md">
            <Container fluid>
                <Navbar.Brand href="/" className={ props.theme }>
                    MOONLIGHT CAFE
                    <Logo className="logo"/>
                </Navbar.Brand>
                <Navbar.Toggle className={ props.theme } aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse role="navigation">
                    <Nav.Link href="/">Home</Nav.Link>
                    
                    <Nav.Link href="/menu/">Menu</Nav.Link>

                    { props.loggedIn &&<Nav.Link href="/dashboard/">Dashboard</Nav.Link> }
                    { props.loggedIn &&<Nav.Link href="/orders/">Orders</Nav.Link> }
                    { props.loggedIn &&<Nav.Link href="/inventory/">Inventory</Nav.Link> }
                    
                    {
                        props.loggedIn ? 
                        <Nav.Link href="/logout/">Logout</Nav.Link>
                        : <Nav.Link href="/login/">Login</Nav.Link>
                    }

                    <Button className={`${ props.theme } theme-toggle`} onClick={() => handleTheme() }>
                        {   
                            props.theme === "light-mode" ?
                                (
                                    <div>
                                        <SunIcon className="theme-icon light fade-in" /> 
                                        <MoonIcon className="theme-icon dark fade-out" />
                                    </div>
                                ) : 
                                (
                                    <div>
                                        <SunIcon className="theme-icon light fade-out" /> 
                                        <MoonIcon className="theme-icon dark fade-in" />
                                    </div>
                                )
                        }
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigate;