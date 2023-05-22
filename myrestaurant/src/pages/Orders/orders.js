import { __assign, __awaiter, __generator } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import OrdersCreateForm from './ordersCreateForm';
import OrderUpdateForm from "./ordersUpdateForm";
import slugify from 'slugify';
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
import { errorFormatter } from '../../utils/formatter';
function Orders() {
    var _this = this;
    var ordersObj = {
        id: null,
        menu_items: [],
        quantity: {},
        notes: "",
        ordered_at: null,
        prepared: false,
        prepared_at: null,
        delivered: false,
        delivered_at: null,
        complete: false
    };
    // Set states
    var _a = useState([]), orders = _a[0], setOrders = _a[1];
    var _b = useState({}), menu = _b[0], setMenu = _b[1];
    var _c = useState(ordersObj), newOrder = _c[0], setNewOrder = _c[1];
    var _d = useState(false), addItem = _d[0], setAddItem = _d[1];
    var _e = useState(ordersObj), updateOrder = _e[0], setUpdateOrder = _e[1];
    var _f = useState(false), updateItem = _f[0], setUpdateItem = _f[1];
    var _g = useState([]), feedback = _g[0], setFeedback = _g[1];
    // Set contexts
    var theme = useContext(ThemeContext);
    // Set variables
    var entries = Object.entries(menu).map(function (item) { return [item[0], item[1].available_quantity]; });
    var availabilities = Object.fromEntries(entries);
    // Fetch menu data from backend
    var getOrders = function () {
        dataAPI.get("".concat(endpoints["orders"])).then(function (response) {
            setOrders(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    var getMenu = function () {
        dataAPI.get("".concat(endpoints["menu"])).then(function (response) {
            var filteredMenu = {};
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
    // Fetch menu when adding or updating forms
    useEffect(function () {
        if (addItem || updateItem) {
            getMenu();
        }
    }, [addItem, updateItem]);
    // Update newOrder || updateOrder state
    var handleData = function (item, value, method) {
        var _a, _b;
        method === "add" ? setNewOrder(__assign(__assign({}, newOrder), (_a = {}, _a[item] = value, _a))) : setUpdateOrder(__assign(__assign({}, updateOrder), (_b = {}, _b[item] = value, _b)));
    };
    // Handle submit multipart form to backend
    var handleSubmit = function (e, method, data) { return __awaiter(_this, void 0, void 0, function () {
        var itemPath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    itemPath = "".concat(endpoints["orders"]).concat(slugify(String(data.id)), "/");
                    _a = method;
                    switch (_a) {
                        case "delete": return [3 /*break*/, 1];
                        case "add": return [3 /*break*/, 3];
                        case "update": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, dataAPI.delete(itemPath).then(function () {
                        console.log("Successfully deleted order number ".concat(data.id));
                        setUpdateItem(false);
                        getOrders();
                    }).catch(function (error) {
                        return console.log(error);
                    })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, dataAPI.post("".concat(endpoints["orders"]), {
                        notes: newOrder.notes,
                        "menu_items[]": newOrder.menu_items,
                        "quantity{}": newOrder.quantity
                    }).then(function () {
                        console.log("Successfully added order number ".concat(data.id));
                        setAddItem(false);
                        getOrders();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, dataAPI.patch(itemPath, {
                        notes: updateOrder.notes,
                        "menu_items[]": updateOrder.menu_items,
                        "quantity{}": updateOrder.quantity
                    }).then(function () {
                        setUpdateItem(false);
                        getOrders();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Unrecognised method");
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Send PATCH request every time an order is prepared, delivered, or completed
    var handleCheck = function (e, id, field, index) {
        var _a;
        var _b, _c, _d;
        e.preventDefault();
        // Rest feedback
        setFeedback([]);
        // Check if checkboxes are ticked in the order prepared > delivered > complete
        if (field === "delivered" && !((_b = orders[index]) === null || _b === void 0 ? void 0 : _b.prepared)) {
            setFeedback(["Please ensure order is prepared."]);
            return;
        }
        else if (field === "complete" && (!((_c = orders[index]) === null || _c === void 0 ? void 0 : _c.prepared) || !((_d = orders[index]) === null || _d === void 0 ? void 0 : _d.delivered))) {
            setFeedback(["Please ensure order is prepared and delivered."]);
            return;
        }
        // Send patch request if the correct checkboxes are checked
        var itemPath = "".concat(endpoints["orders"]).concat(slugify(String(id)), "/");
        dataAPI.patch(itemPath, (_a = {},
            _a[field] = e.target.checked,
            _a)).then(function () { return getOrders(); })
            .catch(function (error) {
            setFeedback(errorFormatter(error));
        });
    };
    return (_jsxs(Container, __assign({ className: "orders ".concat(theme) }, { children: [_jsx(Row, __assign({ className: 'title' }, { children: _jsx("h2", { children: "Orders" }) })), _jsxs(Row, __assign({ xs: 2, className: 'actions' }, { children: [_jsx(Button, __assign({ className: "add", onClick: function () {
                            setNewOrder(__assign({}, ordersObj));
                            setAddItem(!addItem);
                        } }, { children: "Add Item +" })), _jsx(Button, __assign({ className: "archive", as: "a", href: "/orders/archive" }, { children: "Archive" }))] })), _jsx(OrdersCreateForm, { addItem: addItem, onHide: function () { return setAddItem(false); }, newOrder: newOrder, setNewOrder: setNewOrder, menu: menu, handleSubmit: handleSubmit, handleData: handleData, theme: theme, availabilities: availabilities }), _jsx(OrderUpdateForm, { updateItem: updateItem, onHide: function () { setUpdateItem(false); }, updateOrder: updateOrder, setUpdateOrder: setUpdateOrder, menu: menu, handleSubmit: handleSubmit, handleData: handleData, theme: theme, availabilities: availabilities }), _jsx(Row, __assign({ as: "ul", className: "feedback" }, { children: feedback.map(function (message, i) { return _jsx("li", { children: message }, i); }) })), _jsxs(Table, __assign({ responsive: true }, { children: [_jsx("thead", { children: _jsxs("tr", __assign({ className: 'headers' }, { children: [_jsx("th", { children: "Order ID" }), _jsx("th", { children: "Menu Items" }), _jsx("th", { children: "Notes" }), _jsx("th", { children: "Ordered At" }), _jsx("th", { children: "Prepared" }), _jsx("th", { children: "Prepared At" }), _jsx("th", { children: "Delivered" }), _jsx("th", { children: "Delivered At" }), _jsx("th", { children: "Complete" })] })) }), _jsx("tbody", { children: orders.map(function (item, i) {
                            return (_jsxs("tr", __assign({ className: "rows", onClick: function () {
                                    var _a;
                                    setUpdateOrder((_a = __assign({}, item)) !== null && _a !== void 0 ? _a : __assign({}, ordersObj));
                                    setUpdateItem(!updateItem);
                                } }, { children: [_jsx("td", __assign({ className: 'id' }, { children: item.id })), _jsx("td", __assign({ className: 'menu-items' }, { children: item.menu_items.map(function (item2, i) {
                                            var _a;
                                            return (_jsx("p", { children: (_a = menu[item2]) === null || _a === void 0 ? void 0 : _a["title"] }, i));
                                        }) })), _jsx("td", __assign({ className: 'notes' }, { children: item.notes })), _jsx("td", __assign({ className: 'ordered-at' }, { children: String(item.ordered_at) })), _jsx("td", __assign({ className: 'prepared-at-check' }, { children: _jsx(Form.Check, { onChange: function (e) { return handleCheck(e, item.id, "prepared", i); }, onClick: function (e) { return e.stopPropagation(); }, checked: item.prepared }) })), _jsx("td", __assign({ className: 'prepared-at' }, { children: String(item.prepared_at) })), _jsx("td", __assign({ className: 'delivered-at-check' }, { children: _jsx(Form.Check, { onChange: function (e) { return handleCheck(e, item.id, "delivered", i); }, onClick: function (e) { return e.stopPropagation(); }, checked: item.delivered }) })), _jsx("td", __assign({ className: 'delivered-at' }, { children: String(item.delivered_at) })), _jsx("td", __assign({ className: 'complete-check' }, { children: _jsx(Form.Check, { onChange: function (e) { return handleCheck(e, item.id, "complete", i); }, onClick: function (e) { return e.stopPropagation(); }, checked: item.complete }) }))] }), i));
                        }) })] }))] })));
}
;
export default Orders;
