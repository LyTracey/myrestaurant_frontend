import { __assign, __awaiter, __generator } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import placeholder from "../../images/placeholder-image.webp";
import endpoints from "../../data/endpoints";
import InventoryCreateForm from "./inventoryCreateForm";
import InventoryUpdateForm from "./inventoryUpdateForm";
import slugify from "slugify";
import "../../styles/inventory.scss";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
;
function Inventory(props) {
    var _this = this;
    // Set states
    var inventoryObj = {
        id: null,
        ingredient: "",
        quantity: null,
        unit_price: null,
        image: null
    };
    var _a = useState([]), inventory = _a[0], setInventory = _a[1];
    var _b = useState(false), addItem = _b[0], setAddItem = _b[1];
    var _c = useState(false), updateItem = _c[0], setUpdateItem = _c[1];
    var _d = useState(inventoryObj), newInventory = _d[0], setNewInventory = _d[1];
    var _e = useState(inventoryObj), updateInventory = _e[0], setUpdateInventory = _e[1];
    var theme = useContext(ThemeContext);
    // Get inventory
    var getInventory = function () {
        props.dataAPI.get("".concat(endpoints["inventory"])).then(function (response) {
            setInventory(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch inventory on load
    useEffect(function () {
        getInventory();
    }, []);
    // Handle data
    var handleData = function (item, value, method) {
        var _a, _b;
        method === "add" ? setNewInventory(__assign(__assign({}, newInventory), (_a = {}, _a[item] = value, _a))) : setUpdateInventory(__assign(__assign({}, updateInventory), (_b = {}, _b[item] = value, _b)));
    };
    // Handle submit
    var handleSubmit = function (e, method, data) { return __awaiter(_this, void 0, void 0, function () {
        var itemPath, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    itemPath = "".concat(endpoints["inventory"]).concat(slugify((_b = String(data.id)) !== null && _b !== void 0 ? _b : ""), "/");
                    _a = method;
                    switch (_a) {
                        case "delete": return [3 /*break*/, 1];
                        case "add": return [3 /*break*/, 3];
                        case "update": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, props.dataAPI.delete(itemPath).then(function () {
                        console.log("Successfully deleted ".concat(data.ingredient));
                        setUpdateItem(!updateItem);
                        getInventory();
                    }).catch(function (error) {
                        return console.log(error);
                    })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, props.dataAPI.post("".concat(endpoints["inventory"]), {
                        ingredient: newInventory.ingredient,
                        quantity: newInventory.quantity,
                        unit_price: newInventory.unit_price,
                    }).then(function () {
                        setAddItem(!addItem);
                        getInventory();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, props.dataAPI.patch(itemPath, {
                        ingredient: updateInventory.ingredient,
                        quantity: updateInventory.quantity,
                        unit_price: updateInventory.unit_price,
                    }).then(function () {
                        setUpdateItem(!updateItem);
                        getInventory();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Unrecognised method");
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, __assign({ className: "inventory ".concat(theme) }, { children: [_jsx(Row, __assign({ className: 'title' }, { children: _jsx("h2", { children: "Inventory" }) })), _jsx(Row, __assign({ className: 'actions' }, { children: _jsx(Button, __assign({ onClick: function () {
                        setNewInventory(__assign({}, inventoryObj));
                        setAddItem(!addItem);
                    } }, { children: "Add Item +" })) })), _jsx(InventoryCreateForm, { handleSubmit: handleSubmit, handleData: handleData, newInventory: newInventory, addItem: addItem, onHide: function () { return setAddItem(false); }, theme: theme }), _jsx(InventoryUpdateForm, { handleSubmit: handleSubmit, updateItem: updateItem, onHide: function () { return setUpdateItem(false); }, handleData: handleData, updateInventory: updateInventory, theme: theme }), _jsx(Row, __assign({ xs: 1, md: 2, lg: 3 }, { children: inventory.map(function (item, i) {
                    var _a;
                    return (_jsx(Col, { children: _jsxs(Card.Body, __assign({ onClick: function () {
                                setUpdateInventory(__assign(__assign({}, inventoryObj), item));
                                setUpdateItem(!updateItem);
                            } }, { children: [_jsx(Card.Title, { children: item.ingredient }), _jsx(Card.Img, { src: (_a = item.image) !== null && _a !== void 0 ? _a : placeholder }), _jsxs("div", __assign({ className: 'card-details' }, { children: [_jsxs(Card.Text, { children: ["Available: ", item.quantity] }), _jsx(Card.Text, { children: "\u00A3 ".concat(item.unit_price) })] }))] })) }, "inventory-item-".concat(i)));
                }) }))] })));
}
export default Inventory;
