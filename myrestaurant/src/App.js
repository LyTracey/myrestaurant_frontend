import { __assign } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import './App.scss';
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import { Dashboard } from './components/dashboard';
import Navbar from './components/navbar';
function App() {
    return (_jsx("div", __assign({ className: "App" }, { children: _jsx(Navbar, {}) })));
}
export default App;
