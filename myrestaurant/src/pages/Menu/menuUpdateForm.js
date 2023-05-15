import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { ReadFieldGroup, EditFieldGroup, SelectMultiFieldGroup, InputMultiFieldGroup, SubmitDelete, DeleteAlert, ColumnsToRows } from '../Forms/formComponents';
import Container from "react-bootstrap/Container";
import "../../styles/form.scss";
import { useState } from 'react';
function MenuUpdateForm(props) {
    // Set states
    var _a = useState(false), deleteAlert = _a[0], setDeleteAlert = _a[1];
    var _b = useState(false), validated = _b[0], setValidated = _b[1];
    var handleSubmit = function (e) {
        var form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            props.handleSubmit(e, "update", props.updateMenu);
        }
        setValidated(true);
    };
    var Ingredients = SelectMultiFieldGroup({
        name: "ingredients",
        label: "Ingredients",
        data: props.updateMenu,
        reference: props.ingredients,
        values_obj: "units",
        items_list: "ingredients",
        setObj: props.setUpdateMenu
    });
    var Units = InputMultiFieldGroup({
        name: "units",
        label: "Units",
        type: "number",
        data: props.updateMenu,
        reference: props.ingredients,
        values_obj: "units",
        items_list: "ingredients",
        setObj: props.setupdateMenu,
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
    });
    return (_jsxs(Modal, __assign({ className: "menu-form form ".concat(props.theme), show: props.updateItem, onHide: function () {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false);
        } }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Menu Item" }) })), _jsxs(Modal.Body, { children: [_jsxs(Form, __assign({ noValidate: true, validated: validated, onSubmit: function (e) { return handleSubmit(e); } }, { children: [ReadFieldGroup({
                                value: props.updateMenu.title,
                                name: "title",
                                label: "Title",
                                type: "text"
                            }), EditFieldGroup({
                                value: props.updateMenu.description,
                                name: "description",
                                label: "Description",
                                type: "text",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Max character length is 300."
                            }, {
                                maxLength: 300,
                            }), EditFieldGroup({
                                value: props.updateMenu.price,
                                name: "price",
                                label: "Price*",
                                type: "number",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Required. Max character length is 100."
                            }, {
                                maxLength: 100,
                                required: true,
                                min: 0,
                                step: "0.01"
                            }), _jsxs(Container, __assign({ className: "multi-input-container" }, { children: [_jsxs(Row, __assign({ className: "headers" }, { children: [_jsx(Col, __assign({ xs: 6 }, { children: "Ingredients" })), _jsx(Col, __assign({ xs: 6 }, { children: "Units" }))] })), ColumnsToRows([Ingredients, Units], { xs: [6, 6] })] })), SubmitDelete(setDeleteAlert)] })), deleteAlert && DeleteAlert(props.updateMenu, setDeleteAlert, props.handleSubmit)] })] })));
}
;
export default MenuUpdateForm;
