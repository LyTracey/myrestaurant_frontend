import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../style/footer.scss";
import { ReactComponent as Logo } from "../images/moonlight-logo.svg";


function Footer(props: any) {
  return (
    <Navbar expand="xs" className={`footer ${props.theme}`}>
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