import { __awaiter } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import slugify from 'slugify';
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
function ArchivedOrders() {
    // Set states
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState({});
    // Fetch menu data from backend
    const getOrders = () => {
        dataAPI.get(`${endpoints["archivedOrders"]}`).then((response) => {
            setOrders(response.data);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    const getMenu = () => {
        dataAPI.get(`${endpoints["menu"]}`).then((response) => {
            const filteredMenu = {};
            // Return object of id as key and ingredient as value fields for each inventory item 
            response.data.forEach((item) => {
                if (item.available_quantity > 0) {
                    filteredMenu[item.id] = { title: item.title, available_quantity: item.available_quantity };
                }
            });
            setMenu(filteredMenu);
        }).catch((error) => {
            console.log(error);
        });
    };
    // Fetch menu data and ingredients data on first load
    useEffect(() => {
        getOrders();
        getMenu();
    }, []);
    // Handle submit multipart form to backend
    const handleSubmit = (e, id) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const itemPath = `${endpoints["orders"]}${slugify(String(id))}/`;
        dataAPI.patch(itemPath, {
            complete: false
        }).then(() => {
            getOrders();
        }).catch((error) => {
            console.log(error);
        });
    });
    return (_jsxs(Container, Object.assign({ className: `orders ${useContext(ThemeContext)}` }, { children: [_jsx(Row, Object.assign({ className: 'title' }, { children: _jsx("h2", { children: "Archived Orders" }) })), _jsx(Row, Object.assign({ className: 'actions' }, { children: _jsx(Button, Object.assign({ className: "live-orders", as: "a", href: '/orders' }, { children: "Live Orders" })) })), _jsxs(Table, Object.assign({ responsive: true }, { children: [_jsx("thead", { children: _jsxs("tr", Object.assign({ className: 'headers' }, { children: [_jsx("th", { children: "Order ID" }), _jsx("th", { children: "Menu Items" }), _jsx("th", { children: "Notes" }), _jsx("th", { children: "Ordered At" }), _jsx("th", { children: "Prepared At" }), _jsx("th", { children: "Delivered At" }), _jsx("th", {})] })) }), _jsx("tbody", { children: orders.map((item, i) => {
                            return (_jsxs("tr", Object.assign({ className: 'rows' }, { children: [_jsx("td", Object.assign({ className: 'id' }, { children: item.id })), _jsx("td", Object.assign({ className: 'menu-items' }, { children: item.menu_items.map((item, i) => {
                                            var _a;
                                            return (_jsx("p", { children: (_a = menu[item]) === null || _a === void 0 ? void 0 : _a["title"] }, i));
                                        }) })), _jsx("td", Object.assign({ className: 'notes' }, { children: item.notes })), _jsx("td", Object.assign({ className: 'ordered-at' }, { children: String(item.ordered_at) })), _jsx("td", Object.assign({ className: 'prepared-at' }, { children: String(item.prepared_at) })), _jsx("td", Object.assign({ className: 'delivered-at' }, { children: String(item.delivered_at) })), _jsx("td", Object.assign({ className: 'edit-order' }, { children: _jsx(Button, Object.assign({ className: "edit", onClick: (e) => handleSubmit(e, item.id) }, { children: "Edit" })) }))] }), i));
                        }) })] }))] })));
}
;
export default ArchivedOrders;
