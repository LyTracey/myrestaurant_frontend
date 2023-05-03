import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../style/footer.scss";
import { ReactComponent as Logo } from "../images/moonlight-logo.svg";
import { useContext } from 'react';
import { ThemeContext } from './contexts';


function Footer() {

  return (
    <Navbar expand="xs" className={`footer ${useContext(ThemeContext)}`}>
      <Container className='links'>
        <Nav.Link className='about'>About</Nav.Link>
        <Nav.Link className='feedback'>Give Feedback</Nav.Link>
        <Nav.Link className='other-projects'>Other Projects</Nav.Link>
      </Container>
      <Container>
        <Navbar.Brand>
            MOONLIGHT CAFE 
            <Logo className="footer-logo"/>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Footer;