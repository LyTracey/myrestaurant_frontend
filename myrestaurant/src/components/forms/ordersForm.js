import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../style/menuForm.scss';
function OrdersForm(props) {
    return (_jsxs(Modal, __assign({ className: "orders-form ".concat(props.theme), show: props.addItem, onHide: props.onHide }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "New Order" }) })), _jsx(Modal.Body, { children: _jsx(Form, __assign({ onSubmit: function (e) { return props.handleSubmit(e, "add", props.newOrder); } }, { children: _jsxs(Container, { children: [_jsxs(Form.Group, __assign({ className: "field-group notes", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Notes" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "notes", onChange: function (e) { return props.handleData(e.target.name, e.target.value, "add"); }, maxLength: 150 }) }))] })), _jsxs(Row, __assign({ sm: 5, className: "field-group menu-quantity" }, { children: [_jsx(Col, __assign({ sm: 3, className: 'menu-items label' }, { children: _jsx(Form.Label, { children: "Menu Items" }) })), _jsx(Col, __assign({ as: "fieldset", sm: 4, className: "menu-items multi-input" }, { children: Object.entries(props.menu).map(function (item, i) {
                                            return (_jsx(Form.Check, { className: 'field', type: "checkbox", label: item[1].title, name: "is", value: item[0], onChange: function (e) { return props.handleQuantity(String(item[0]), e.target.checked, "add", props.newOrder); } }, i));
                                        }) })), _jsx(Col, __assign({ as: "fieldset", sm: 1, className: "menu-items availability" }, { children: Object.entries(props.menu).map(function (item, i) {
                                            return (_jsx(Form.Text, __assign({ as: "div", className: "field" }, { children: item[1].available_quantity }), i));
                                        }) })), _jsx(Col, __assign({ sm: 2, className: 'quantity label' }, { children: _jsx(Form.Label, { children: "Quantity" }) })), _jsx(Col, __assign({ sm: 2, className: 'quantity multi-input' }, { children: Object.entries(props.menu).map(function (item, i) {
                                            var _a;
                                            return ((_a = props.newOrder.menu_items) !== null && _a !== void 0 ? _a : []).includes(Number(item[0])) ?
                                                _jsx(Form.Control, { className: "field", type: "number", name: "quantity", onChange: function (e) { return props.handleQuantity(String(item[0]), true, "add", props.newOrder, Number(e.target.value)); }, required: true, min: 1, max: item[1].available_quantity }, i)
                                                :
                                                    _jsx("div", { className: "field" }, i);
                                        }) }))] })), _jsx(Row, __assign({ className: "form-actions", lg: 8 }, { children: _jsx(Button, __assign({ type: "submit", className: 'submit' }, { children: "Submit" })) }))] }) })) })] })));
}
export default OrdersForm;
