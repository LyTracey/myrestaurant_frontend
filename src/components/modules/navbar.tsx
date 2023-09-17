import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import "../../styles/navbar.scss";
import Button from 'react-bootstrap/Button';
import { ReactComponent as Logo } from "../../images/icons/moonlight-cafe-logo.svg";
import { GlobalContext } from '../pages/App';
import { useContext } from 'react';
import { internalEndpoints } from '../../data/endpoints';
import ICONS from '../../data/icons';


function Navigation() {

    const { theme: [theme, setTheme], user: [user] } = useContext(GlobalContext);
    const { MenuIcon, SunIcon, MoonIcon } = ICONS;


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
                <NavLink to={ internalEndpoints.home! } className="link brand">
                    MOONLIGHT CAFE
                    <Logo className="icon logo"/>
                </NavLink>

                <Navbar.Toggle aria-controls="responsive-navbar-nav"><MenuIcon className="icon" /></Navbar.Toggle>
                <Navbar.Collapse className="nav-links" role="navigation" >
                    <Nav>        
                        <Nav.Link eventKey="1" as={ NavLink } to={ internalEndpoints.menu! } className="link">Menu</Nav.Link>

                        { (user.isStaff && ["MANAGER", "SALES"].includes(user.role)) && <Nav.Link eventKey="2" as={ NavLink } to={ internalEndpoints.dashboard! } className="link">Dashboard</Nav.Link> }
                        { (user.isStaff && ["MANAGER", "SALES"].includes(user.role)) && <Nav.Link eventKey="3" as={ NavLink } to={ internalEndpoints.orders! } className="link">Orders</Nav.Link> }
                        { (user.isStaff && ["MANAGER", "CHEF"].includes(user.role)) && <Nav.Link eventKey="4" as={ NavLink } to={ internalEndpoints.inventory! } className="link">Inventory</Nav.Link> }
                        { localStorage.getItem("access") && <Nav.Link eventKey="5" as={ NavLink } to={ internalEndpoints.profile! } className="link">Profile</Nav.Link>}
                        {
                            localStorage.getItem("access") ? 
                            <Nav.Link eventKey="6" as={ NavLink } to={ internalEndpoints.logout! } className="link">Logout</Nav.Link>
                            : <Nav.Link eventKey="7" as={ NavLink } to={ internalEndpoints.login! } className="link">Login</Nav.Link>
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
        </Navbar>
    )
}

export default Navigation;