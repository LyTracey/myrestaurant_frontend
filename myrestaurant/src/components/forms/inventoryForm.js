import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../../style/inventoryForm.scss";
function InventoryForm(props) {
    return (_jsxs(Modal, __assign({ className: "inventory-form ".concat(props.theme), show: props.addItem, onHide: props.onHide }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Add Inventory Item" }) })), _jsx(Modal.Body, { children: _jsx(Form, __assign({ onSubmit: function (e) { return props.handleSubmit(e, "add", props.newInventory); } }, { children: _jsxs(Container, { children: [_jsxs(Form.Group, __assign({ className: "ingredient", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Ingredient" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "ingredient", required: true, onChange: function (e) { return props.handleData(e.target.name, e.target.value, "add"); } }) }))] })), _jsxs(Form.Group, __assign({ className: "quantity", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Quantity Available" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "number", name: "quantity", onChange: function (e) { return props.handleData(e.target.name, e.target.value, "add"); } }) }))] })), _jsxs(Form.Group, __assign({ className: "unit_price", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Unit Price" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "number", name: "unit_price", step: "0.01", required: true, onChange: function (e) { return props.handleData(e.target.name, Number(e.target.value), "add"); } }) }))] })), _jsx(Row, __assign({ className: "form-actions", lg: 8 }, { children: _jsx(Button, __assign({ type: "submit", className: 'submit' }, { children: "Submit" })) }))] }) })) })] })));
}
export default InventoryForm;
