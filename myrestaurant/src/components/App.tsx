import '../style/App.scss';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './dashboard';
import Navbar from './navbar';
import { useState, useEffect } from 'react';
import Menu from "./menu";
import Inventory from './inventory';
import Orders from './orders';
import Footer from './footer';
import ArchivedOrders from './ordersArchive';
import Home from './home';
import Register from './register';
import Login from './login';
import Logout from './logout';
import { ThemeContext } from './contexts';
import axios from "axios";
import { checkTokens } from './utils';
import PrivateRoute from './privateRoute';

function App() {
    
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");
    const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("access")) ?? false)

    // Set default axios headers
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    // Set loggedIn storage on first render
    useEffect(() => {
        sessionStorage.setItem("loggedIn", "false");
    }, []);

    useEffect(() => {
        if (sessionStorage.getItem("access")) {
            const tokensValid = checkTokens();
            if (!tokensValid) {
                sessionStorage.removeItem("access");
                sessionStorage.setItem("loggedIn", "false");
                setLoggedIn(false);
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${ sessionStorage.getItem("access") }`;
        } 
    });
    
    return (
        <div className={`App ${ theme }`}>
            <ThemeContext.Provider value={theme}>
                <Navbar theme={ theme } setTheme={ setTheme } loggedIn={ loggedIn } />
                <Router>
                    <Routes>
                        <Route path="/" element={ <Home /> } />
                        <Route path="/menu/" element={ <Menu /> } /> 
                        <Route path="/login/" element={ <Login setLoggedIn={setLoggedIn}/>} />
                        <Route path="/logout/" element={ <Logout setLoggedIn={setLoggedIn}/>} />
                        <Route path="/register/" element={ <Register />} />
                        <Route path="/" element={ <PrivateRoute loggedIn={ loggedIn }/>}>
                            <Route path="/dashboard/" element={ <Dashboard /> } />
                            <Route path="/inventory/" element={ <Inventory /> } />
                            <Route path="/orders/" element={ <Orders />} />
                            <Route path="/orders/archive" element={ <ArchivedOrders /> } />
                        </Route>
                    </Routes>
                </Router>
                <Footer />
            </ThemeContext.Provider>
        </div>
    )
}

export default App;
