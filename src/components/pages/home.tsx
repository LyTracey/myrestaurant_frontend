import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HomeImageLight from "../../images/home-image-light.png";
import HomeImageDark from "../../images/home-image-dark.png";
import HomeBackgroundLight from "../../images/home-background-light.png";
import HomeBackgroundDark from "../../images/home-background-dark.png";
import "../../styles/home.scss";
import { useContext } from 'react';
import { GlobalContext } from '../App';

function Home () {

    const { theme: [theme] } = useContext(GlobalContext);

    return (
        <Container className={`page home ${ theme }`} fluid>
            <Row className="home-screen">
                <div className="gradient"></div>
                <img className="home-image" src={ theme === "light-mode" ? HomeImageLight : HomeImageDark } alt="Bunny and moon" ></img>
                <img className="home-background" src={ theme === "light-mode" ? HomeBackgroundLight : HomeBackgroundDark } alt="Speckles"></img>
            </Row>

            
            <Container className="text-block">
                <Row>
                    <Col className="text greeting">
                        <h3>Welcome!</h3>
                        <p>
                            <br/>
                            This is a website for a fictitious cafe built to put into practice my full-stack development skills. I chose a cafe as a real-world scenario to develop my use cases around.
                            Please feel free to explore the site and its functionalities.<br/>
                            <br/>
                            - Tracey
                        </p>

                    </Col>
                </Row>

                <Row>
                    <Col className="text tech-stack">
                        <h3>The Tech-Stack</h3>

                        <p>
                            The source code for this project can be found on my GitHub: XXX.
                        </p>
                        
                        <ul>
                            <li>
                                The backend has a REST-API architecture and is built using Django and Django Rest Framework and is connected to a MYSQL database.
                            </li>

                            <li>
                                The frontend is built using TypeScript, React, React-Bootstrap and SCSS.
                            </li>

                            <li>
                                I also created the images and icons using a combination of Procreate and Vectornator.
                            </li>
                        </ul>
                    </Col >
                </Row>

                <Row>
                    <Col className="text considerations">
                        <h3>
                            Considerations
                        </h3>
                        
                        <p>
                            As I only intended this website to be a personal project, my tech-stack is not built around scalability. I have also opted to use only open-source tools.
                        </p>

                    </Col>
                </Row>
            </Container>



        </Container>
    )

};

export default Home;