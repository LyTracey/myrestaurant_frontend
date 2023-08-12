import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import "../../styles/navbar.scss";
import { ReactComponent as SunIcon } from "../../images/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../images/icons/moon.svg";
import { Menu } from 'react-feather';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Logo } from "../../images/icons/moonlight-cafe-logo.svg";
import { GlobalContext } from '../App';
import { useContext } from 'react';


function Navigation() {

    const { theme: [theme, setTheme], user: [user] } = useContext(GlobalContext);

    const handleTheme = () => {
        if (localStorage.getItem("theme") === "light-mode"){
            setTheme("dark-mode");
            localStorage.setItem("theme", "dark-mode");
        } else {
            setTheme("light-mode");
            localStorage.setItem("theme", "light-mode");
        }
    };

    return (
        <Navbar className={ theme } collapseOnSelect sticky="top" expand="md">
            <Container fluid>
                <NavLink to="/" className="link brand">
                    MOONLIGHT CAFE
                    <Logo className="icon logo"/>
                </NavLink>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"><Menu className="icon" /></Navbar.Toggle>
                <Navbar.Collapse role="navigation">
                    <Nav>
                        { user.isStaff && <NavLink to="/" className="link">Home</NavLink> }
                        
                        <NavLink to="/menu" className="link">Menu</NavLink>

                        { (user.isStaff && ["MANAGER", "SALES"].includes(user.role)) && <NavLink to="/dashboard" className="link">Dashboard</NavLink> }
                        { (user.isStaff && ["MANAGER", "SALES"].includes(user.role)) && <NavLink to="/orders" className="link">Orders</NavLink> }
                        { (user.isStaff && ["MANAGER", "CHEF"].includes(user.role)) && <NavLink to="/inventory" className="link">Inventory</NavLink> }
                        { sessionStorage.getItem("access") && <NavLink to="/profile" className="link">Profile</NavLink>}
                        {
                            sessionStorage.getItem("access") ? 
                            <NavLink to="/logout" className="link">Logout</NavLink>
                            : <NavLink to="/login" className="link">Login</NavLink>
                        }

                    </Nav>
                    <Button className={`${ theme } theme-toggle`} onClick={() => handleTheme() }>
                        {   
                            theme === "light-mode" ?
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

export default Navigation;