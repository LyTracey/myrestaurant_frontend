import { __assign, __awaiter, __generator } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import "../style/orders.scss";
import Table from 'react-bootstrap/Table';
import slugify from 'slugify';
function ArchivedOrders(props) {
    var _this = this;
    // Set states
    var _a = useState([]), orders = _a[0], setOrders = _a[1];
    var _b = useState({}), menu = _b[0], setMenu = _b[1];
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    // Fetch menu data from backend
    var getOrders = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["archivedOrders"])).then(function (response) {
            setOrders(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    var getMenu = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["menu"])).then(function (response) {
            var filteredMenu = {};
            // Return object of id as key and ingredient as value fields for each inventory item 
            response.data.forEach(function (item) {
                if (item.in_stock) {
                    filteredMenu[item.id] = { title: item.title, available_quantity: item.available_quantity };
                }
            });
            setMenu(filteredMenu);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch menu data and ingredients data on first load
    useEffect(function () {
        getOrders();
        getMenu();
    }, []);
    // Handle submit multipart form to backend
    var handleSubmit = function (e, id) { return __awaiter(_this, void 0, void 0, function () {
        var itemPath;
        return __generator(this, function (_a) {
            e.preventDefault();
            itemPath = "".concat(endpoints.prefix).concat(endpoints["orders"]).concat(slugify(String(id)), "/");
            axios.patch(itemPath, {
                complete: false
            }).then(function () {
                getOrders();
            }).catch(function (error) {
                console.log(error);
            });
            return [2 /*return*/];
        });
    }); };
    return (_jsxs(Container, __assign({ className: "orders ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title' }, { children: _jsx("h2", { children: "Archived Orders" }) })), _jsx(Row, __assign({ className: 'actions' }, { children: _jsx(Button, __assign({ className: "live-orders", as: "a", href: '/orders' }, { children: "Live Orders" })) })), _jsxs(Table, __assign({ responsive: true }, { children: [_jsx("thead", { children: _jsxs("tr", __assign({ className: 'headers' }, { children: [_jsx("th", { children: "Order ID" }), _jsx("th", { children: "Menu Items" }), _jsx("th", { children: "Notes" }), _jsx("th", { children: "Ordered At" }), _jsx("th", { children: "Prepared At" }), _jsx("th", { children: "Delivered At" }), _jsx("th", {})] })) }), _jsx("tbody", { children: orders.map(function (item, i) {
                            return (_jsxs("tr", __assign({ className: 'rows' }, { children: [_jsx("td", __assign({ className: 'id' }, { children: item.id })), _jsx("td", __assign({ className: 'menu-items' }, { children: item.menu_items.map(function (item, i) {
                                            var _a;
                                            return (_jsx("p", { children: (_a = menu[item]) === null || _a === void 0 ? void 0 : _a["title"] }, i));
                                        }) })), _jsx("td", __assign({ className: 'notes' }, { children: item.notes })), _jsx("td", __assign({ className: 'ordered-at' }, { children: String(item.ordered_at) })), _jsx("td", __assign({ className: 'prepared-at' }, { children: String(item.prepared_at) })), _jsx("td", __assign({ className: 'delivered-at' }, { children: String(item.delivered_at) })), _jsx("td", __assign({ className: 'edit-order' }, { children: _jsx(Button, __assign({ className: "edit", onClick: function (e) { return handleSubmit(e, item.id); } }, { children: "Edit" })) }))] }), i));
                        }) })] }))] })));
}
;
export default ArchivedOrders;
