import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import App from './pages/Base/App';
// import reportWebVitals from './reportWebVitals';
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
// <React.StrictMode>
_jsx(App, {})
// {/* </React.StrictMode> */}
);
