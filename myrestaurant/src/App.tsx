import './App.scss';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import Navbar from './components/navbar';

function App() {

    return (
        <div className="App">
            <Navbar />
            <Router>
                <Routes>
                    <Route path="/dashboard/" element={ <Dashboard /> } />
                </Routes>
            </Router>

        </div>
    )
}

export default App;
