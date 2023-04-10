import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuForm from './forms/menuForm';
import MenuUpdateForm from './forms/menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import "../style/menu.scss";
import slugify from 'slugify';
import placeholder from "../images/placeholder-image.webp";
function Menu(props) {
    var _this = this;
    // Set states
    var menuObj = {
        id: null,
        title: "",
        description: "",
        price: null,
        image: null,
        ingredients: [],
        units: {}
    };
    var _a = useState([]), menu = _a[0], setMenu = _a[1];
    var _b = useState({}), ingredients = _b[0], setIngredients = _b[1];
    var _c = useState(menuObj), newMenu = _c[0], setNewMenu = _c[1];
    var _d = useState(false), addItem = _d[0], setAddItem = _d[1];
    var _e = useState(menuObj), updateMenu = _e[0], setUpdateMenu = _e[1];
    var _f = useState(false), updateItem = _f[0], setUpdateItem = _f[1];
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    // Fetch menu data from backend
    var getMenu = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["menu"])).then(function (response) {
            setMenu(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    var getIngredients = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["inventory"])).then(function (response) {
            var filteredInventory = {};
            // Return object of id as key and ingredient as value fields for each inventory item
            response.data.forEach(function (item) { return (filteredInventory[item.id] = item.ingredient); });
            setIngredients(filteredInventory);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch menu data and ingredients data on first load
    useEffect(function () {
        getMenu();
        getIngredients();
    }, []);
    // Update newMenu state
    var handleData = function (item, value, method) {
        var _a, _b;
        method === "add" ? setNewMenu(__assign(__assign({}, newMenu), (_a = {}, _a[item] = value, _a))) : setUpdateMenu(__assign(__assign({}, updateMenu), (_b = {}, _b[item] = value, _b)));
    };
    // Update newMenu units and ingredients state
    var handleUnits = function (item, checked, method, data, value) {
        if (checked === void 0) { checked = false; }
        if (value === void 0) { value = ""; }
        var obj = __assign({}, data);
        if (checked) {
            obj.units[item] = value;
            if (!obj.ingredients.includes(Number(item))) {
                obj.ingredients = __spreadArray(__spreadArray([], obj.ingredients, true), [Number(item)], false);
            }
        }
        else {
            delete obj.units[item];
            obj.ingredients = obj.ingredients.filter(function (id) { return id !== Number(item); });
        }
        method === "add" ? setNewMenu(obj) : setUpdateMenu(obj);
    };
    // Handle submit multipart form to backend
    var handleSubmit = function (e, method, data) { return __awaiter(_this, void 0, void 0, function () {
        var itemPath, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    itemPath = "".concat(endpoints.prefix).concat(endpoints["menu"]).concat(slugify((_b = data.title) !== null && _b !== void 0 ? _b : ""), "/");
                    _a = method;
                    switch (_a) {
                        case "delete": return [3 /*break*/, 1];
                        case "add": return [3 /*break*/, 3];
                        case "update": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 1: return [4 /*yield*/, axios.delete(itemPath).then(function () {
                        console.log("Successfully deleted ".concat(data.title));
                        setUpdateItem(!updateItem);
                        getMenu();
                    }).catch(function (error) {
                        return console.log(error);
                    })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, axios.postForm("".concat(endpoints.prefix).concat(endpoints["menu"]), {
                        title: newMenu.title,
                        description: newMenu.description,
                        price: newMenu.price,
                        "ingredients[]": newMenu.ingredients,
                        "units{}": newMenu.units
                    }, { formSerializer: { metaTokens: false, indexes: null } }).then(function () {
                        setAddItem(!addItem);
                        getMenu();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 5:
                    axios.patchForm(itemPath, {
                        description: updateMenu.description,
                        price: updateMenu.price,
                        "ingredients[]": updateMenu.ingredients,
                        "units{}": updateMenu.units
                    }, { formSerializer: { metaTokens: false, indexes: null } }).then(function () {
                        setUpdateItem(!updateItem);
                        getMenu();
                    }).catch(function (error) {
                        console.log(error);
                    });
                    return [3 /*break*/, 7];
                case 6:
                    console.log("Unrecognised method");
                    _c.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, __assign({ className: "menu ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Menu" }) })), _jsx(Row, __assign({ className: 'actions' }, { children: _jsx(Button, __assign({ onClick: function () { return setAddItem(!addItem); } }, { children: "Add Item +" })) })), _jsx(MenuForm, { handleSubmit: handleSubmit, handleData: handleData, handleUnits: handleUnits, ingredients: ingredients, newMenu: newMenu, addItem: addItem, onHide: function () { return setAddItem(false); }, theme: props.theme }), _jsx(Row, __assign({ xs: 1, md: 2, lg: 3 }, { children: menu.map(function (item, i) {
                    var _a;
                    return (_jsx(Col, { children: _jsxs(Card.Body, __assign({ onClick: function () {
                                setUpdateMenu(__assign(__assign({}, menuObj), item));
                                setUpdateItem(!updateItem);
                            } }, { children: [_jsx(Card.Title, { children: item.title }), _jsx(Card.Img, { src: (_a = item.image) !== null && _a !== void 0 ? _a : placeholder }), _jsxs("div", __assign({ className: 'card-details' }, { children: [_jsx(Card.Text, { children: item.description }), _jsx(Card.Text, { children: "\u00A3 ".concat(item.price) }), _jsxs(Card.Text, { children: ["Ingredients: ", item.ingredients.map(function (item) { return ingredients[item]; }).join(", ")] })] }))] })) }, "menu-item-".concat(i)));
                }) })), _jsx(MenuUpdateForm, { handleSubmit: handleSubmit, updateItem: updateItem, onHide: function () { return setUpdateItem(false); }, handleData: handleData, handleUnits: handleUnits, ingredients: ingredients, updateMenu: updateMenu, theme: props.theme })] })));
}
;
export default Menu;
