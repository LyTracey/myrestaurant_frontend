import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import App from './pages/Base/App';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
// <React.StrictMode>
_jsx(BrowserRouter, { children: _jsx(App, {}) })
// {/* </React.StrictMode> */}
);
