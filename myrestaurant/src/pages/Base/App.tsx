import '../../styles/App.scss';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, createContext } from 'react';
import Dashboard from '../Dashboard/dashboard';
import Navbar from '../Base/navbar';
import Menu from "../Menu/menu";
import Inventory from '../Inventory/inventory';
import Orders from '../Orders/orders';
import Footer from '../Base/footer';
import ArchivedOrders from '../Orders/ordersArchive';
import Home from '../Home/home';
import Register from '../Login/register';
import Login from '../Login/login';
import Logout from '../Login/logout';
import PrivateRoute from './privateRoute';;

// Create ThemeContext
export const ThemeContext = createContext('light-mode');

function App() {
    
    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");
    const [loggedIn, setLoggedIn] = useState(Boolean(sessionStorage.getItem("access")) ?? false)
    


    // Set default axios headers
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

    
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
