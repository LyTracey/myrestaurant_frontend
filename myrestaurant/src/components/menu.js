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
    var ingredients = { 1: "Garlic", 10: "Beef Mince", 6: "Chives" };
    // Set states
    var _a = useState([]), menu = _a[0], setMenu = _a[1];
    var _b = useState({
        title: "",
        description: "",
        ingredients: [],
        units: {},
        price: 0,
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
    useEffect(function () {
        console.log(newMenu);
    }, [newMenu]);
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
    // Handle selected ingredients
    var handleSubmit = function (e) {
        e.preventDefault();
        var selectedIngredients = Object.entries(newMenu.units).filter(function (item) { return item[1] > 0; }).map(function (item) { return Number(item[0]); });
        setNewMenu(__assign(__assign({}, newMenu), { ingredients: selectedIngredients }));
    };
    return (_jsxs(Container, __assign({ className: "menu ".concat(props.theme) }, { children: [_jsx(Row, __assign({ className: 'title justify-content-center' }, { children: _jsx("h2", { children: "Menu" }) })), _jsxs(Form, __assign({ onSubmit: function (e) { return handleSubmit(e); } }, { children: [_jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Title" }), _jsx(Form.Control, { type: "text", name: "title", required: true, onChange: function (e) { return handleData(e.target.name, e.target.value); } })] }), _jsxs(Row, __assign({ xs: 2 }, { children: [_jsxs(Form.Group, __assign({ className: 'ingredients' }, { children: [_jsx(Form.Label, { children: "Ingredients" }), Object.entries(ingredients).map(function (item, i) {
                                        return (_jsx(Form.Check, { type: "checkbox", label: item[1], name: "ingredients", value: item[0], onChange: function (e) { return handleUnits(Number(item[0]), e.target.checked); } }, i));
                                    })] })), _jsxs(Form.Group, __assign({ className: 'units' }, { children: [_jsx(Form.Label, { children: "Units" }), Object.entries(ingredients).map(function (item, i) {
                                        return item[0] in newMenu.units ?
                                            _jsx(Form.Control, { type: "number", name: "units", step: ".01", onChange: function (e) { return handleUnits(Number(item[0]), true, Number(e.target.value)); }, required: true }, i) :
                                            _jsx("div", {}, i);
                                    })] }))] })), _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Description" }), _jsx(Form.Control, { type: "text", name: "description", onChange: function (e) { return handleData(e.target.name, e.target.value); } })] }), _jsxs(Form.Group, { children: [_jsx(Form.Label, { children: "Price" }), _jsx(Form.Control, { type: "number", name: "price", step: ".01", required: true, onChange: function (e) { return handleData(e.target.name, e.target.value); } })] }), _jsx(Button, __assign({ type: "submit" }, { children: "Submit" }))] })), _jsx(Row, { children: menu.map(function (item, i) {
                    return (_jsx(Col, { children: _jsxs(Card.Body, { children: [_jsx(Card.Title, { children: item.title }), _jsx(Card.Img, { src: item.image }), _jsx(Card.Text, { children: item.description }), _jsx(Card.Text, { children: "\u00A3 ".concat(item.price) }), _jsx(Card.Text, { children: "Ingredients: ".concat(item.ingredients) })] }) }, "menu-item-".concat(i)));
                }) })] })));
}
;
export default Menu;
