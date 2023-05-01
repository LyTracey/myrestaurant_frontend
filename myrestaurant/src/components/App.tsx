import '../style/App.scss';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './dashboard';
import Navbar from './navbar';
import { useState } from 'react';
import Menu from "./menu";
import Inventory from './inventory';
import Orders from './orders';
import Footer from './footer';
import ArchivedOrders from './ordersArchive';
import Home from './home';

function App() {

    const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "light-mode");

    return (
        <div className={`App ${ theme }`}>
            <Navbar theme={ theme } setTheme={ setTheme }/>
            <Router>
                <Routes>
                    <Route path="/" element={ <Home theme={ theme }/> } />
                    <Route path="/dashboard/" element={ <Dashboard theme={ theme }/> } />
                    <Route path="/menu/" element={ <Menu theme={ theme }/> } />
                    <Route path="/inventory/" element={ <Inventory theme={ theme }/> } />
                    <Route path="/orders/" element={ <Orders theme={ theme }/> } />
                    <Route path="/orders/archive" element={ <ArchivedOrders theme={ theme }/>} />
                </Routes>
            </Router>
            <Footer theme={ theme }/>
        </div>
    )
}

export default App;
