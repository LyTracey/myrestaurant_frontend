import './style/App.scss';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './components/dashboard';
import Navbar from './components/navbar';
import { useState } from 'react';
import Menu from "./components/menu";

function App() {

    const [theme, setTheme] = useState("light-mode");

    return (
        <div className={`App ${ theme }`}>
            <Navbar theme={ theme } setTheme={ setTheme }/>
            <Router>
                <Routes>
                    <Route path="/dashboard/" element={ <Dashboard theme={ theme }/> } />
                    <Route path="/menu/" element={ <Menu theme={ theme }/> } />
                </Routes>
            </Router>

        </div>
    )
}

export default App;
