import { __assign, __awaiter, __generator } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuCreateForm from './menuCreateForm';
import MenuUpdateForm from './menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/menu.scss";
import slugify from 'slugify';
import { ReactComponent as CoffeeCup } from "../../images/icons/coffee-cup.svg";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';
;
;
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
    var theme = useContext(ThemeContext);
    // Fetch menu data from backend
    var getMenu = function () {
        dataAPI.get("".concat(endpoints["menu"])).then(function (response) {
            setMenu(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Fetch ingredients from backend
    var getIngredients = function () {
        dataAPI.get("".concat(endpoints["inventory"])).then(function (response) {
            var filteredInventory = {};
            // Return object of id as key and ingredient as value fields for each inventory item
            response.data.forEach(function (item) { return (filteredInventory[item.id] = { title: item.ingredient }); });
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
    // Handle submit multipart form to backend
    var handleSubmit = function (e, method, data) { return __awaiter(_this, void 0, void 0, function () {
        var itemPath, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    itemPath = "".concat(endpoints["menu"]).concat(slugify((_b = data.title) !== null && _b !== void 0 ? _b : ""), "/");
                    _a = method;
                    switch (_a) {
                        case "delete": return [3 /*break*/, 1];
                        case "add": return [3 /*break*/, 3];
                        case "update": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 1: return [4 /*yield*/, dataAPI.delete(itemPath).then(function () {
                        console.log("Successfully deleted ".concat(data.title));
                        setUpdateItem(false);
                        getMenu();
                    }).catch(function (error) {
                        return console.log(error);
                    })];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, dataAPI.post("".concat(endpoints["menu"]), {
                        title: newMenu.title,
                        description: newMenu.description,
                        price: newMenu.price,
                        "ingredients[]": newMenu.ingredients,
                        "units{}": newMenu.units
                    }).then(function () {
                        setAddItem(false);
                        getMenu();
                    }).catch(function (error) {
                        console.log(error);
                    })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 7];
                case 5:
                    dataAPI.patch(itemPath, {
                        description: updateMenu.description,
                        price: updateMenu.price,
                        "ingredients[]": updateMenu.ingredients,
                        "units{}": updateMenu.units
                    }).then(function () {
                        setUpdateItem(false);
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
    return (_jsxs(Container, __assign({ className: "menu ".concat(useContext(ThemeContext)) }, { children: [_jsx(Row, __assign({ className: 'title' }, { children: _jsx("h2", { children: "Menu" }) })), (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) &&
                _jsx(Row, __assign({ xs: 2, className: 'actions' }, { children: _jsx(Button, __assign({ className: "add", onClick: function () {
                            setNewMenu(__assign({}, menuObj));
                            setAddItem(!addItem);
                        } }, { children: "Add Item +" })) })), _jsx(MenuCreateForm, { theme: theme, addItem: addItem, onHide: function () { return setAddItem(false); }, handleSubmit: handleSubmit, newMenu: newMenu, setNewMenu: setNewMenu, handleData: handleData, ingredients: ingredients }), _jsx(Row, __assign({ xs: 1, md: 2, lg: 3 }, { children: menu.map(function (item, i) {
                    return (_jsx(Col, { children: _jsxs(Card.Body, __assign({ onClick: function () {
                                if (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) { // Only render update form if user isStaff and has a role of MANAGER | CHEF
                                    setUpdateMenu(__assign(__assign({}, menuObj), item));
                                    setUpdateItem(!updateItem);
                                }
                            }, className: !props.isStaff ? "default-cursor" : "" }, { children: [_jsx(Card.Title, { children: item.title }), _jsx(CoffeeCup, { className: "icon" }), _jsxs("div", __assign({ className: 'card-details' }, { children: [_jsx(Card.Text, { children: item.description }), _jsx(Card.Text, { children: "\u00A3 ".concat(item.price) }), _jsxs(Card.Text, { children: ["Ingredients: ", item.ingredients.map(function (item) { return ingredients[item]["title"]; }).join(", ")] })] }))] })) }, "menu-item-".concat(i)));
                }) })), _jsx(MenuUpdateForm, { onHide: function () { return setUpdateItem(false); }, handleSubmit: handleSubmit, updateItem: updateItem, handleData: handleData, theme: theme, ingredients: ingredients, updateMenu: updateMenu, setUpdateMenu: setUpdateMenu })] })));
}
;
export default Menu;
