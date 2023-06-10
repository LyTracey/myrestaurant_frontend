import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HomeImageLight from "../../images/home-image-light.png";
import HomeImageDark from "../../images/home-image-dark.png";
import HomeBackgroundLight from "../../images/home-background-light.png";
import HomeBackgroundDark from "../../images/home-background-dark.png";
import "../../styles/home.scss";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
function Home() {
    const theme = useContext(ThemeContext);
    return (_jsxs(Container, Object.assign({ className: `home ${theme}` }, { children: [_jsxs(Row, Object.assign({ className: "home-screen" }, { children: [_jsx("div", { className: "gradient" }), _jsx("img", { className: "home-image", src: theme === "light-mode" ? HomeImageLight : HomeImageDark }), _jsx("img", { className: "home-background", src: theme === "light-mode" ? HomeBackgroundLight : HomeBackgroundDark })] })), _jsxs(Container, Object.assign({ className: "text-block" }, { children: [_jsx(Row, { children: _jsxs(Col, Object.assign({ className: "text greeting" }, { children: [_jsx("h3", { children: "Welcome!" }), _jsxs("p", { children: [_jsx("br", {}), "This is a website for a fictitious cafe built to put into practice my full-stack development skills. I chose a cafe as a real-world scenario to develop my use cases around. Please feel free to explore the site and its functionalities.", _jsx("br", {}), _jsx("br", {}), "- Tracey"] })] })) }), _jsx(Row, { children: _jsxs(Col, Object.assign({ className: "text tech-stack" }, { children: [_jsx("h3", { children: "The Tech-Stack" }), _jsx("p", { children: "The source code for this project can be found on my GitHub: XXX." }), _jsxs("ul", { children: [_jsx("li", { children: "The backend has a REST-API architecture and is built using Django and Django Rest Framework and is connected to a MYSQL database." }), _jsx("li", { children: "The frontend is built using TypeScript, React, React-Bootstrap and SCSS." }), _jsx("li", { children: "I also created the images and icons using a combination of Procreate and Vectornator." })] })] })) }), _jsx(Row, { children: _jsxs(Col, Object.assign({ className: "text considerations" }, { children: [_jsx("h3", { children: "Considerations" }), _jsx("p", { children: "As I only intended this website to be a personal project, my tech-stack is not built around scalability. I have also opted to use only open-source tools." })] })) })] }))] })));
}
;
export default Home;
