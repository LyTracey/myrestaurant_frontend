import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import '../../styles/form.scss';
import Modal from "react-bootstrap/Modal";
import { EditFieldGroup, DeleteAlert, SubmitDelete } from "../Forms/formComponents";
import Form from "react-bootstrap/Form";
function InventoryUpdateForm(props) {
    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        else {
            props.handleSubmit(e, "update", props.updateInventory);
        }
        setValidated(true);
    };
    return (_jsxs(Modal, Object.assign({ className: `inventory-form page-form ${props.theme}`, show: props.updateItem, onHide: () => {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false);
        } }, { children: [_jsx(Modal.Header, Object.assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Inventory Item" }) })), _jsxs(Modal.Body, { children: [_jsxs(Form, Object.assign({ noValidate: true, validated: validated, onSubmit: e => handleSubmit(e) }, { children: [EditFieldGroup({
                                value: props.updateInventory.ingredient,
                                name: "ingredient",
                                label: "Ingredient*",
                                type: "text",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Required. Max character length is 100."
                            }, {
                                maxLength: 100,
                                required: true
                            }), EditFieldGroup({
                                value: props.updateInventory.quantity,
                                name: "quantity",
                                label: "Quantity Available*",
                                type: "number",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Required. Minimum is 0."
                            }, {
                                min: 0,
                                required: true
                            }), EditFieldGroup({
                                value: props.updateInventory.unit_price,
                                name: "unit_price",
                                label: "Unit Price*",
                                type: "number",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Required. Minimum is £0.00."
                            }, {
                                min: 0,
                                required: true,
                                step: 0.01
                            }), SubmitDelete(setDeleteAlert)] })), deleteAlert && DeleteAlert(props.updateInventory, setDeleteAlert, props.handleSubmit)] })] })));
}
;
export default InventoryUpdateForm;
