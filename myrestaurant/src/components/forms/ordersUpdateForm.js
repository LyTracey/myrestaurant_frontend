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
import '../../style/menuForm.scss';
function OrderUpdateForm(props) {
    // Set states
    var _a = useState(false), deleteAlert = _a[0], setDeleteAlert = _a[1];
    return (_jsxs(Modal, __assign({ className: "orders-form ".concat(props.theme), show: props.updateItem, onHide: function () {
            setDeleteAlert(false);
            props.onHide();
        } }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Order Item" }) })), _jsxs(Modal.Body, { children: [_jsx(Form, __assign({ onSubmit: function (e) { return props.handleSubmit(e, "update", props.updateOrder); } }, { children: _jsxs(Container, { children: [_jsxs(Form.Group, __assign({ className: "id", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "ID" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "id", defaultValue: props.updateOrder.id, readOnly: true, disabled: true }) }))] })), _jsxs(Form.Group, __assign({ className: "notes", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Notes" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "notes", defaultValue: props.updateOrder.notes, onChange: function (e) { return props.handleData(e.target.name, e.target.value, "update"); } }) }))] })), _jsxs(Row, __assign({ sm: 4, className: "menu-quantity" }, { children: [_jsx(Col, __assign({ sm: 3, className: 'menu-items label' }, { children: _jsx(Form.Label, { children: "Menu Items" }) })), _jsx(Col, __assign({ sm: 4, className: "menu-items multi-input" }, { children: Object.entries(props.menu).map(function (item, i) {
                                                return (_jsx(Form.Check, { className: "field", type: "checkbox", label: item[1], name: "menu_items", value: item[0], checked: props.updateOrder.menu_items.includes(Number(item[0])), onChange: function (e) { return props.handleQuantity(String(item[0]), e.target.checked, "update", props.updateOrder); } }, i));
                                            }) })), _jsx(Col, __assign({ sm: 2, className: 'quantity label' }, { children: _jsx(Form.Label, { children: "Units" }) })), _jsx(Col, __assign({ sm: 3, className: 'quantity multi-input' }, { children: Object.keys(props.menu).map(function (item, i) {
                                                var _a, _b;
                                                return ((_a = props.updateOrder.menu_items) !== null && _a !== void 0 ? _a : []).includes(Number(item))
                                                    ? _jsx(Form.Control, { className: "field", type: "number", name: "quantity", value: (_b = props.updateOrder.quantity[String(item)]) !== null && _b !== void 0 ? _b : "", onChange: function (e) { return props.handleQuantity(String(item), true, "update", props.updateOrder, Number(e.target.value)); }, required: true }, i)
                                                    : _jsx("div", {}, i);
                                            }) }))] })), _jsxs(Row, __assign({ className: "form-actions", lg: 8 }, { children: [_jsx(Button, __assign({ type: "submit", className: "submit" }, { children: "Submit" })), _jsx(Button, __assign({ type: "button", className: "delete", onClick: function () { return setDeleteAlert(true); } }, { children: "DELETE" }))] }))] }) })), deleteAlert &&
                        _jsxs(Alert, __assign({ onClose: function () { return setDeleteAlert(false); }, dismissible: true }, { children: [_jsx(Alert.Heading, { children: "Are you sure you want to delete this item?" }), _jsxs("div", __assign({ className: 'alert-actions' }, { children: [_jsx(Button, __assign({ type: "button", className: "cancel", onClick: function () { return setDeleteAlert(false); } }, { children: "Cancel" })), _jsx(Button, __assign({ type: "button", className: "yes", onClick: function (e) {
                                                props.handleSubmit(e, "delete", props.updateOrder);
                                                setDeleteAlert(false);
                                            } }, { children: "Yes" }))] }))] }))] })] })));
}
export default OrderUpdateForm;
