import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/orders.scss";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import OrdersForm from './ordersForm';
import OrderUpdateForm from './ordersUpdateForm';
import slugify from 'slugify';
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
function Orders(props) {
    var _this = this;
    // Set states
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
    var _a = useState([]), orders = _a[0], setOrders = _a[1];
    var _b = useState({}), menu = _b[0], setMenu = _b[1];
    var _c = useState(ordersObj), newOrder = _c[0], setNewOrder = _c[1];
    var _d = useState(false), addItem = _d[0], setAddItem = _d[1];
    var _e = useState(ordersObj), updateOrder = _e[0], setUpdateOrder = _e[1];
    var _f = useState(false), updateItem = _f[0], setUpdateItem = _f[1];
    // Fetch menu data from backend
    var getOrders = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["orders"])).then(function (response) {
            setOrders(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    var getMenu = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["menu"])).then(function (response) {
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
    useEffect(function () { return console.log(updateOrder); });
    useEffect(function () { return getMenu(); }, [addItem, updateItem]);
    // Update newOrder | updateOrder state
    var handleData = function (item, value, method) {
        var _a, _b;
        method === "add" ? setNewOrder(__assign(__assign({}, newOrder), (_a = {}, _a[item] = value, _a))) : setUpdateOrder(__assign(__assign({}, updateOrder), (_b = {}, _b[item] = value, _b)));
    };
    // Update newMenu units and ingredients state
    var handleQuantity = function (item, checked, method, data, value) {
        if (checked === void 0) { checked = false; }
        var obj = __assign({}, data);
        if (checked) {
            obj.quantity[item] = value !== null && value !== void 0 ? value : "";
            if (!obj.menu_items.includes(Number(item))) {
                obj.menu_items = __spreadArray(__spreadArray([], obj.menu_items, true), [Number(item)], false);
            }
        }
        else {
            delete obj.quantity[item];
            obj.menu_items = obj.menu_items.filter(function (id) { return id !== Number(item); });
        }
        method === "add" ? setNewOrder(obj) : setUpdateOrder(obj);
    };
    // Handle submit multipart form to backend
    var handleSubmit = function (e, method, data) { return __awaiter(_this, void 0, void 0, function () {
        var itemPath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    itemPath = "".concat(endpoints.prefix).concat(endpoints["orders"]).concat(slugify(String(data.id)), "/");
                    _a = method;
                    switch (_a) {
                        case "delete": return [3 /*break*/, 1];
                        case "add": return [3 /*break*/, 3];
                        case "update": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 1: return [4 /*yield*/, axios.delete(itemPath).then(function () {
                        console.log("Successfully deleted order number ".concat(data.id));
                        setUpdateItem(false);
                        getOrders();
                    }).catch(function (error) {
                        return console.log(error);
                    })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, axios.postForm("".concat(endpoints.prefix).concat(endpoints["orders"]), {
                        notes: newOrder.notes,
                        "menu_items[]": newOrder.menu_items,
                        "quantity{}": newOrder.quantity
                    }, { formSerializer: { metaTokens: false, indexes: null } }).then(function () {
                        console.log("Successfully added order number ".concat(data.id));
                        setAddItem(false);
                        getOrders();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5:
                    axios.patchForm(itemPath, {
                        notes: updateOrder.notes,
                        "menu_items[]": updateOrder.menu_items,
                        "quantity{}": updateOrder.quantity
                    }, { formSerializer: { metaTokens: false, indexes: null } }).then(function () {
                        setUpdateItem(false);
                        getOrders();
                    }).catch(function (error) {
                        console.log(error);
                    });
                    return [3 /*break*/, 7];
                case 6:
                    console.log("Unrecognised method");
                    _b.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleCheck = function (e, id, field) {
        var _a;
        e.preventDefault();
        var itemPath = "".concat(endpoints.prefix).concat(endpoints["orders"]).concat(slugify(String(id)), "/");
        axios.patch(itemPath, (_a = {},
            _a[field] = e.target.checked,
            _a)).then(function () { return getOrders(); })
            .catch(function (error) {
            console.log(error);
        });
    };
    return (_jsxs(Container, __assign({ className: "orders ".concat(useContext(ThemeContext)) }, { children: [_jsx(Row, __assign({ className: 'title' }, { children: _jsx("h2", { children: "Orders" }) })), _jsxs(Row, __assign({ xs: 2, className: 'actions' }, { children: [_jsx(Button, __assign({ className: "add", onClick: function () {
                            setNewOrder(ordersObj);
                            setAddItem(!addItem);
                        } }, { children: "Add Item +" })), _jsx(Button, __assign({ className: "archive", as: "a", href: "/orders/archive" }, { children: "Archive" }))] })), _jsx(OrdersForm, { addItem: addItem, onHide: function () { return setAddItem(false); }, handleData: handleData, handleQuantity: handleQuantity, handleSubmit: handleSubmit, newOrder: newOrder, menu: menu, theme: props.theme }), _jsxs(Table, __assign({ responsive: true }, { children: [_jsx("thead", { children: _jsxs("tr", __assign({ className: 'headers' }, { children: [_jsx("th", { children: "Order ID" }), _jsx("th", { children: "Menu Items" }), _jsx("th", { children: "Notes" }), _jsx("th", { children: "Ordered At" }), _jsx("th", { children: "Prepared" }), _jsx("th", { children: "Prepared At" }), _jsx("th", { children: "Delivered" }), _jsx("th", { children: "Delivered At" }), _jsx("th", { children: "Complete" })] })) }), _jsx("tbody", { children: orders.map(function (item, i) {
                            return (_jsxs("tr", __assign({ className: "rows", onClick: function () {
                                    setUpdateOrder(__assign(__assign({}, ordersObj), item));
                                    setUpdateItem(!updateItem);
                                } }, { children: [_jsx("td", __assign({ className: 'id' }, { children: item.id })), _jsx("td", __assign({ className: 'menu-items' }, { children: item.menu_items.map(function (item, i) {
                                            var _a;
                                            return (_jsx("p", { children: (_a = menu[item]) === null || _a === void 0 ? void 0 : _a["title"] }, i));
                                        }) })), _jsx("td", __assign({ className: 'notes' }, { children: item.notes })), _jsx("td", __assign({ className: 'ordered-at' }, { children: String(item.ordered_at) })), _jsx("td", __assign({ className: 'prepared-at-check' }, { children: _jsx(Form.Check, { onChange: function (e) { return handleCheck(e, item.id, "prepared"); }, onClick: function (e) { return e.stopPropagation(); }, checked: item.prepared }) })), _jsx("td", __assign({ className: 'prepared-at' }, { children: String(item.prepared_at) })), _jsx("td", __assign({ className: 'delivered-at-check' }, { children: _jsx(Form.Check, { onChange: function (e) { return handleCheck(e, item.id, "delivered"); }, onClick: function (e) { return e.stopPropagation(); }, checked: item.delivered }) })), _jsx("td", __assign({ className: 'delivered-at' }, { children: String(item.delivered_at) })), _jsx("td", __assign({ className: 'complete-check' }, { children: _jsx(Form.Check, { onChange: function (e) { return handleCheck(e, item.id, "complete"); }, onClick: function (e) { return e.stopPropagation(); }, checked: item.complete }) }))] }), i));
                        }) })] })), _jsx(OrderUpdateForm, { updateItem: updateItem, onHide: function () { return setUpdateItem(false); }, handleData: handleData, handleQuantity: handleQuantity, updateOrder: updateOrder, menu: menu, handleSubmit: handleSubmit, theme: props.theme })] })));
}
;
export default Orders;
