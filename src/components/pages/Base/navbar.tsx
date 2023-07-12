import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import "../../../styles/navbar.scss";
import { ReactComponent as SunIcon } from "../../../images/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../../images/icons/moon.svg";
import { Menu } from 'react-feather';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Logo } from "../../../images/icons/moonlight-cafe-logo.svg";
import { ThemeContext } from './App';
import { useContext } from 'react';


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
                <NavLink to="/" className="link brand">
                    MOONLIGHT CAFE
                    <Logo className="icon logo"/>
                </NavLink>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"><Menu className="icon" /></Navbar.Toggle>
                <Navbar.Collapse role="navigation">
                    <Nav activeKey={ props.location.pathname }>
                        { !props.isStaff && <NavLink to="/" className="link">Home</NavLink> }
                        
                        <NavLink to="/menu" className="link">Menu</NavLink>

                        { (props.isStaff && ["MANAGER", "SALES"].includes(props.role)) && <NavLink to="/dashboard" className="link">Dashboard</NavLink> }
                        { (props.isStaff && ["MANAGER", "SALES"].includes(props.role)) && <NavLink to="/orders" className="link">Orders</NavLink> }
                        { (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) && <NavLink to="/inventory" className="link">Inventory</NavLink> }
                        { props.loggedIn && <NavLink to="/profile" className="link">Profile</NavLink>}
                        {
                            props.loggedIn ? 
                            <NavLink to="/logout" className="link">Logout</NavLink>
                            : <NavLink to="/login" className="link">Login</NavLink>
                        }

                    </Nav>
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