import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "../styles/footer.scss";
import { ReactComponent as Logo } from "../assets/icons/moonlight-cafe-logo.svg";
import { useContext } from "react";
import { GlobalContext } from "../App";

function Footer() {
  const {
    theme: [theme],
  } = useContext(GlobalContext);

  return (
    <Navbar expand="xs" className={`footer ${theme}`}>
      {/* <Container className='links'>
        <Nav.Link className='about'>About</Nav.Link>
        <Nav.Link className='feedback'>Give Feedback</Nav.Link>
        <Nav.Link className='other-projects'>Other Projects</Nav.Link>
      </Container> */}
      <Container>
        <Navbar.Brand href="/">
          MOONLIGHT CAFE
          <Logo className="icon footer-logo" />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Footer;
