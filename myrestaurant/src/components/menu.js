import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import "../style/menu.scss";
function Menu(props) {
    // Test ingredients
    var ingredients = ["Garlic", "Beef Mince", "Tomatoes"];
    // Set states
    var _a = useState([]), menu = _a[0], setMenu = _a[1];
    var _b = useState({
        title: null,
        description: "",
        price: 0,
        ingredients: {}
    }), newMenu = _b[0], setNewMenu = _b[1];
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    // Get menu data
    var getMenu = function (method, data) {
        if (data === void 0) { data = null; }
        axios({
            method: method,
            url: "".concat(endpoints.prefix).concat(endpoints["menu"]),
            data: data
        }).then(function (response) {
            setMenu(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    };
    // UseEffect
    useEffect(function () {
        getMenu("get");
    }, []);
    // Handle selected ingredients
    var handleSubmit = function (e) {
        e.preventDefault();
        e.target.ingredients.forEach(function (item) { return console.log(item.value); });
    };
    // Update menu
    var handleSelectedIngredients = function (checked, item) {
        var obj = __assign({}, newMenu);
        checked ? obj.ingredients[item] = 0 : delete obj.ingredients[item];
        setNewMenu(obj);
    };
    return (_jsxs(Container, __assign({ className: "menu ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Menu" }) })), _jsxs(Form, __assign({ onSubmit: function (e) { return handleSubmit(e); } }, { children: [_jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Title" }), _jsx(Form.Control, { type: "text", name: "title" })] }), _jsxs(Row, __assign({ xs: 2 }, { children: [_jsxs(Form.Group, __assign({ className: 'ingredients' }, { children: [_jsx(Form.Label, { children: "Ingredients" }), ingredients.map(function (item, i) {
                                        return (_jsx(Form.Check, { type: "checkbox", label: item, name: "ingredients", value: item, onChange: function (e) { return handleSelectedIngredients(e.target.checked, item); } }, i));
                                    })] })), _jsxs(Form.Group, __assign({ className: 'units' }, { children: [_jsx(Form.Label, { children: "Units" }), ingredients.map(function (item, i) { return item in newMenu.ingredients && _jsx(Form.Control, { type: "number", name: "units" }, i); })] }))] })), _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Description" }), _jsx(Form.Control, { type: "text", name: "description" })] }), _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Price" }), _jsx(Form.Control, { type: "number", name: "price" })] }), _jsx(Button, __assign({ type: "submit" }, { children: "Submit" }))] })), _jsx(Row, { children: menu.map(function (item, i) {
                    return (_jsx(Col, { children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { children: item.title }), _jsx(Card.Img, { src: item.image }), _jsx(Card.Text, { children: item.description }), _jsx(Card.Text, { children: "\u00A3 ".concat(item.price) }), _jsx(Card.Text, { children: "Ingredients: ".concat(item.ingredients) })] }) }, "menu-item-".concat(i)));
                }) })] })));
}
;
export default Menu;
