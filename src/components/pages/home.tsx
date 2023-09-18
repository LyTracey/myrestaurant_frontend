import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import HomeImageLight from "../../images/home-image-light.png";
import HomeImageDark from "../../images/home-image-dark.png";
import HomeBackgroundLight from "../../images/home-background-light.png";
import HomeBackgroundDark from "../../images/home-background-dark.png";
import "../../styles/home.scss";
import { useContext, useState } from 'react';
import { GlobalContext } from './App';
import Col from "react-bootstrap/Col";
import ICONS from "../../data/icons";
import { NavLink } from "react-router-dom";
import { internalEndpoints } from "../../data/endpoints";

function Button ({ text, url }: any) {
    return (
        <button className="link" type="button" onClick={(e: any) => {
            e.stopPropagation();
            window.open(url, "_blank");
        }}>{ text }</button>
    )
};


function Home () {
    
    const { theme: [theme] } = useContext(GlobalContext);
    const [activeBox, setActiveBox] = useState<string>("greeting");
    const { StarsIcon, ThoughtIcon, GithubIcon, StackIcon } = ICONS;

    return (
        <Container className={`page home ${ theme }`} fluid>
            <Row className="home-screen" >
                <div className="gradient"></div>
                <img className="home-image" src={ theme === "light-mode" ? HomeImageLight : HomeImageDark } alt="Bunny and moon" ></img>
                <img className="home-background" src={ theme === "light-mode" ? HomeBackgroundLight : HomeBackgroundDark } alt="Speckles"></img>
            </Row>


            <Row className="text" xs={1} md={2} xl={4}>
                <img className="home-background" src={ theme === "light-mode" ? HomeBackgroundLight : HomeBackgroundDark } alt="Speckles"></img>
                
                
                <Col className="greeting" onClick={() => setActiveBox("greeting")}>
                    <div className="box">
                        {
                            activeBox !== "greeting" ? <StarsIcon className="icon" /> : (
                                <>
                                    <h3 className="title">Welcome!</h3>
                                    This website is for a fictitious cafe built to practice full-stack development. I chose a cafe as a real-world scenario to develop my use cases around.
                                    Please feel free to explore the site and its functionalities. <br/>

                                    <br/>
                                    
                                    P.S. I suggest you account <NavLink onClick={e => e.stopPropagation()} className="link" to={ internalEndpoints.register! }>here</NavLink><br/>
                                    <br/>
                                    - Tracey
                                </>
                            )
                        }
                    </div>
                </Col>


                <Col className="source-code" onClick={() => setActiveBox("source-code")}>
                    <div className="box">
                        {
                            activeBox !== "source-code" ? <GithubIcon className="icon" /> : (
                                <>
                                    <h3 className="title">Source Code</h3>
                                    The source code for this project can be found on my GitHub at the following links:<br/>
                                    <br/>
                                    <li>
                                        <Button text="Django Backend" url="https://github.com/LyTracey/myrestaurant_backend"/><br/>
                                    </li>
                                    <li>
                                        <Button text="React JS Frontend" url="https://github.com/LyTracey/myrestaurant_frontend" />
                                    </li>
                                </>
                            )
                        }
                    </div>
                </Col>
            
                <Col className="tech-stack" onClick={() => setActiveBox("tech-stack")}>
                    <div className="box">
                            {
                                activeBox !== "tech-stack" ? <StackIcon className="icon" /> : (
                                    <>
                                        <h3 className="title">The Tech-Stack</h3>
                                        The backend is built using Django and Django Rest Framework connected to a MySQL database. 
                                        It is hosted using <Button text="Python Anywhere" url="https://www.pythonanywhere.com/" />.<br />
                                        
                                        <br />

                                        The frontend is built using TypeScript, React, React-Bootstrap and SCSS.
                                        It is hosted on <Button text="Vercel" url="https://vercel.com/" />.<br />

                                        <br />

                                        I also created some images and icons using a combination 
                                        of <Button text="Procreate" url="https://procreate.com/" /> and <Button text="Vectornator" url="https://www.linearity.io/" />.
                                        Other icons use the <Button text="React Icons" url="https://react-icons.github.io/react-icons/" /> package.
                                    </>
                                )
                            }
                    </div>
                </Col>


                <Col className="considerations" onClick={() => setActiveBox("considerations")}>
                    <div className="box">
                        {
                            activeBox !== "considerations" ? <ThoughtIcon className="icon" /> : (
                                <>
                                    <h3 className="title">Considerations</h3>
                                    As I only intended this website to be a personal project, I have opted to use only open-source tools.
                                </>

                            )
                        }
                    </div>
                </Col>
            
            </Row>



        </Container>
    )

};

export default Home;