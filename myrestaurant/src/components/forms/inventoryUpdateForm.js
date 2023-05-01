import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import "../../style/inventoryForm.scss";
function InventoryUpdateForm(props) {
    var _a;
    // Set states
    var _b = useState(false), deleteAlert = _b[0], setDeleteAlert = _b[1];
    return (_jsxs(Modal, __assign({ className: "inventory-form ".concat(props.theme), show: props.updateItem, onHide: function () {
            setDeleteAlert(false);
            props.onHide();
        } }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Inventory Item" }) })), _jsxs(Modal.Body, { children: [_jsx(Form, __assign({ onSubmit: function (e) { return props.handleSubmit(e, "update", props.updateInventory); } }, { children: _jsxs(Container, { children: [_jsxs(Form.Group, __assign({ className: "field-group id", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "ID" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "id", defaultValue: (_a = String(props.updateInventory.id)) !== null && _a !== void 0 ? _a : 0, readOnly: true, disabled: true }) }))] })), _jsxs(Form.Group, __assign({ className: "field-group ingredient", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Ingredient" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "title", defaultValue: props.updateInventory.ingredient, readOnly: true, disabled: true, maxLength: 100 }) }))] })), _jsxs(Form.Group, __assign({ className: "field-group quantity", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Quantity Available" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "number", name: "quantity", step: "0.01", defaultValue: props.updateInventory.quantity, onChange: function (e) { return props.handleData(e.target.name, e.target.value, "update"); }, min: 0 }) }))] })), _jsxs(Form.Group, __assign({ className: "unit_price", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Unit Price" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "number", name: "price", step: "0.01", required: true, defaultValue: props.updateInventory.unit_price, onChange: function (e) { return props.handleData(e.target.name, Number(e.target.value), "update"); }, min: 0 }) }))] })), _jsxs(Row, __assign({ className: "form-actions", lg: 8 }, { children: [_jsx(Button, __assign({ type: "submit", className: "submit" }, { children: "Submit" })), _jsx(Button, __assign({ type: "button", className: "delete", onClick: function () { return setDeleteAlert(true); } }, { children: "DELETE" }))] }))] }) })), deleteAlert &&
                        _jsxs(Alert, __assign({ onClose: function () { return setDeleteAlert(false); }, dismissible: true }, { children: [_jsx(Alert.Heading, { children: "Are you sure you want to delete this item?" }), _jsxs("div", __assign({ className: 'alert-actions' }, { children: [_jsx(Button, __assign({ type: "button", className: "cancel", onClick: function () { return setDeleteAlert(false); } }, { children: "Cancel" })), _jsx(Button, __assign({ type: "button", className: "yes", onClick: function (e) {
                                                props.handleSubmit(e, "delete", props.updateInventory);
                                                setDeleteAlert(false);
                                            } }, { children: "Yes" }))] }))] }))] })] })));
}
export default InventoryUpdateForm;
