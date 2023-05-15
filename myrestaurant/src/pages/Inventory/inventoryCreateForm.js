import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { EditFieldGroup, Submit } from '../Forms/formComponents';
import { useState } from 'react';
import "../../styles/form.scss";
function InventoryCreateForm(props) {
    // Set states
    var _a = useState(false), validated = _a[0], setValidated = _a[1];
    var handleSubmit = function (e) {
        var form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            props.handleSubmit(e, "add", props.newInventory);
        }
        setValidated(true);
    };
    return (_jsxs(Modal, __assign({ className: "inventory-form form ".concat(props.theme), show: props.addItem, onHide: function () {
            props.onHide();
            setValidated(false);
        } }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "New Inventory Item" }) })), _jsx(Modal.Body, { children: _jsxs(Form, __assign({ noValidate: true, validated: validated, onSubmit: function (e) { return handleSubmit(e); } }, { children: [EditFieldGroup({
                            value: props.newInventory.ingredient,
                            name: "ingredient",
                            label: "Ingredient*",
                            type: "text",
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true
                        }), EditFieldGroup({
                            value: props.newInventory.quantity,
                            name: "quantity",
                            label: "Quantity Available*",
                            type: "number",
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Minimum is 0."
                        }, {
                            min: 0,
                            required: true
                        }), EditFieldGroup({
                            value: props.newInventory.unit_price,
                            name: "unit_price",
                            label: "Unit Price*",
                            type: "number",
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Minimum is £0.00."
                        }, {
                            min: 0,
                            required: true,
                            step: 0.01
                        }), Submit()] })) })] })));
}
;
export default InventoryCreateForm;
