import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import HomeImageLight from "../../images/home-image-light.png";
import HomeImageDark from "../../images/home-image-dark.png";
import HomeBackgroundLight from "../../images/home-background-light.png";
import HomeBackgroundDark from "../../images/home-background-dark.png";
import "../../styles/home.scss";
import { useContext } from 'react';
import { GlobalContext } from './App';
import Col from "react-bootstrap/Col";

function Home () {

    const { theme: [theme] } = useContext(GlobalContext);

    return (
        <Container className={`page home ${ theme }`} fluid>
            <Row className="home-screen">
                <div className="gradient"></div>
                <img className="home-image" src={ theme === "light-mode" ? HomeImageLight : HomeImageDark } alt="Bunny and moon" ></img>
                <img className="home-background" src={ theme === "light-mode" ? HomeBackgroundLight : HomeBackgroundDark } alt="Speckles"></img>
                <div className="slogan">FOOD . DRINKS . GAMES </div>
            </Row>

            
                <Row className="text">
                    
                    <Col className="text greeting">
                        <h3 className="title">Welcome!</h3>
                        <p>
                            <br/>
                            This website is for a fictitious cafe built to practice full-stack development. I chose a cafe as a real-world scenario to develop my use cases around.
                            Please feel free to explore the site and its functionalities.<br/>
                            <br/>
                            - Tracey
                        </p>
                    </Col>


                <Col className="text tech-stack">
                        <h3 className="title">The Tech-Stack</h3>
                        <p>
                            The source code for this project can be found on my GitHub at the following links:<br/>
                            <li>
                                <a className="link" href="https://github.com/LyTracey/myrestaurant_backend">Django backend</a><br/>
                            </li>
                            <li>
                                <a className="link" href="https://github.com/LyTracey/myrestaurant_frontend">React JS Frontend</a><br/>
                            </li>
                        </p>
                        <div>
                            The backend is built using Django and Django Rest Framework connected to a MYSQL database. 
                            It is hosted using <a className="link" href="https://www.pythonanywhere.com/">Python Anywhere</a>
                        </div>

                        <br/>

                        <div>
                            The frontend is built using TypeScript, React, React-Bootstrap and SCSS.
                            It is hosted on <a className="link" href="https://vercel.com/">Vercel</a>
                        </div>

                        <br/>

                        <div>
                            I created images and icons using a combination of Procreate and Vectornator.
                            Other icons use the <a className="link" href="https://react-icons.github.io/react-icons/">React-Icons</a> package.
                        </div>
                
                </Col>


                <Col className="text considerations">
                    
                        <h3 className="title">Considerations</h3>
                        <p>
                            As I only intended this website to be a personal project, I have opted to use only open-source tools.
                        </p>
                </Col>
                
                </Row>



        </Container>
    )

};

export default Home;