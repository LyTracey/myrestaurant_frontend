import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { EditFieldGroup, SelectMultiFieldGroup, InputMultiFieldGroup, Submit, ColumnsToRows } from '../Forms/formComponents';
import Container from "react-bootstrap/Container";
import "../../styles/form.scss";
import { useState } from 'react';
function MenuCreateForm(props) {
    // Set states
    var _a = useState(false), validated = _a[0], setValidated = _a[1];
    var handleSubmit = function (e) {
        var form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            props.handleSubmit(e, "add", props.newMenu);
        }
        setValidated(true);
    };
    var Ingredients = SelectMultiFieldGroup({
        name: "ingredients",
        label: "Ingredients",
        data: props.newMenu,
        reference: props.ingredients,
        values_obj: "units",
        items_list: "ingredients",
        setObj: props.setNewMenu
    });
    var Units = InputMultiFieldGroup({
        name: "units",
        label: "Units",
        type: "number",
        data: props.newMenu,
        reference: props.ingredients,
        values_obj: "units",
        items_list: "ingredients",
        setObj: props.setNewMenu,
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
    });
    return (_jsxs(Modal, __assign({ className: "menu-form form ".concat(props.theme), show: props.addItem, onHide: function () {
            props.onHide();
            setValidated(false);
        } }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "New Menu Item" }) })), _jsx(Modal.Body, { children: _jsxs(Form, __assign({ noValidate: true, validated: validated, onSubmit: function (e) { return handleSubmit(e); } }, { children: [EditFieldGroup({
                            value: props.newMenu.title,
                            name: "title",
                            label: "Title*",
                            type: "text",
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true
                        }), EditFieldGroup({
                            value: props.newMenu.description,
                            name: "description",
                            label: "Description",
                            type: "text",
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Max character length is 300."
                        }, {
                            maxLength: 300,
                        }), EditFieldGroup({
                            value: props.newMenu.price,
                            name: "price",
                            label: "Price*",
                            type: "number",
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true,
                            min: 0,
                            step: "0.01"
                        }), _jsxs(Container, __assign({ className: "multi-input-container" }, { children: [_jsxs(Row, __assign({ className: "headers" }, { children: [_jsx(Col, __assign({ xs: 6 }, { children: "Ingredients" })), _jsx(Col, __assign({ xs: 6 }, { children: "Units" }))] })), ColumnsToRows([Ingredients, Units], { xs: [6, 6] })] })), Submit()] })) })] })));
}
;
export default MenuCreateForm;
