import { __assign, __awaiter, __generator } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuForm from './forms/menuForm';
import endpoints from '../data/endpoints';
import Button from 'react-bootstrap/Button';
import "../style/menu.scss";
function Menu(props) {
    var _this = this;
    // Set states
    var _a = useState([]), menu = _a[0], setMenu = _a[1];
    var _b = useState({}), ingredients = _b[0], setIngredients = _b[1];
    var _c = useState({
        title: "",
        description: "",
        price: 0.00,
        ingredients: [],
        units: {},
    }), newMenu = _c[0], setNewMenu = _c[1];
    var _d = useState(false), addItem = _d[0], setAddItem = _d[1];
    // const [updateMenu, setUpdateMenu ] = useState<MenuObj>({
    //     id: null,
    //     title: "",
    //     description: "",
    //     price: null,
    //     image: "",
    //     ingredients: [],
    //     units: {}
    // });
    // Test ingredients
    // const ingredients: {[key: string]: string} = {"1": "Garlic", "2": "Pork Mince", "3": "Beef Mince"};
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    // Request menu data
    var getMenu = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["menu"])).then(function (response) {
            setMenu(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // Test ingredients
    var getIngredients = function () {
        axios.get("".concat(endpoints.prefix).concat(endpoints["inventory"])).then(function (response) {
            var filteredInventory = {};
            response.data.forEach(function (item) { return (filteredInventory[item.id] = item.ingredient); });
            setIngredients(filteredInventory);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // UseEffect
    useEffect(function () {
        getMenu();
        getIngredients();
    }, []);
    // Update data
    var handleData = function (item, value) {
        var _a;
        setNewMenu(__assign(__assign({}, newMenu), (_a = {}, _a[item] = value, _a)));
    };
    var handleUnits = function (item, checked, value) {
        if (checked === void 0) { checked = false; }
        if (value === void 0) { value = 0; }
        var obj = __assign({}, newMenu);
        checked ? obj.units[item] = value : delete obj.units[item];
        setNewMenu(obj);
    };
    // Handle submit multipart form to backend
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var selectedIngredients;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    selectedIngredients = Object.entries(newMenu.units).filter(function (item) { return item[1] > 0; }).map(function (item) { return Number(item[0]); });
                    setNewMenu(__assign(__assign({}, newMenu), { ingredients: selectedIngredients }));
                    return [4 /*yield*/, axios.postForm("".concat(endpoints.prefix).concat(endpoints["menu"]), {
                            title: newMenu.title,
                            description: newMenu.description,
                            price: newMenu.price,
                            "ingredients[]": newMenu.ingredients,
                            "units{}": newMenu.units,
                        }, { formSerializer: { metaTokens: false, indexes: null } })];
                case 1:
                    _a.sent();
                    getMenu();
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs(Container, __assign({ className: "menu ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Menu" }) })), _jsx(Button, __assign({ onClick: function () { return setAddItem(!addItem); } }, { children: "Add Item +" })), _jsx(MenuForm, { handleSubmit: handleSubmit, handleData: handleData, handleUnits: handleUnits, ingredients: ingredients, newMenu: newMenu, addItem: addItem, onHide: function () { return setAddItem(false); } }), _jsx(Row, __assign({ xs: 1, md: 2, lg: 3 }, { children: menu.map(function (item, i) {
                    return (_jsx(Col, { children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { children: item.title }), _jsx(Card.Img, { src: item.image }), _jsx(Card.Text, { children: item.description }), _jsx(Card.Text, { children: "\u00A3 ".concat(item.price) }), _jsxs(Card.Text, { children: ["Ingredients: ", item.ingredients.map(function (item) { return ingredients[item]; }).join(", ")] })] }) }, "menu-item-".concat(i)));
                }) }))] })));
}
;
export default Menu;
