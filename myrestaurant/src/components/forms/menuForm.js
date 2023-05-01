import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../style/menuForm.scss';
function MenuForm(props) {
    return (_jsxs(Modal, __assign({ className: "menu-form ".concat(props.theme), show: props.addItem, onHide: props.onHide }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Add Menu Item" }) })), _jsx(Modal.Body, { children: _jsx(Form, __assign({ onSubmit: function (e) { return props.handleSubmit(e, "add", props.newMenu); } }, { children: _jsxs(Container, { children: [_jsxs(Form.Group, __assign({ className: "field-group title", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Title" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "title", required: true, onChange: function (e) { return props.handleData(e.target.name, e.target.value, "add"); }, maxLength: 100 }) }))] })), _jsxs(Form.Group, __assign({ className: "field-group description", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Description" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "description", onChange: function (e) { return props.handleData(e.target.name, e.target.value, "add"); }, maxLength: 300 }) }))] })), _jsxs(Form.Group, __assign({ className: "field-group price", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Price" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "number", name: "price", step: "0.01", required: true, onChange: function (e) { return props.handleData(e.target.name, Number(e.target.value), "add"); }, min: 0 }) }))] })), _jsxs(Row, __assign({ sm: 4, className: "field-group ingredients-units" }, { children: [_jsx(Col, __assign({ sm: 3, className: 'ingredients label' }, { children: _jsx(Form.Label, { children: "Ingredients" }) })), _jsx(Col, __assign({ sm: 5, className: "ingredients multi-input" }, { children: Object.entries(props.ingredients).map(function (item, i) {
                                            return (_jsx(Form.Check, { className: "field", type: "checkbox", label: item[1], name: "ingredients", value: item[0], onChange: function (e) { return props.handleUnits(String(item[0]), e.target.checked, "add", props.newMenu); } }, i));
                                        }) })), _jsx(Col, __assign({ sm: 2, className: 'units label' }, { children: _jsx(Form.Label, { children: "Units" }) })), _jsx(Col, __assign({ sm: 2, className: 'units multi-input' }, { children: Object.entries(props.ingredients).map(function (item, i) {
                                            var _a;
                                            return ((_a = props.newMenu.ingredients) !== null && _a !== void 0 ? _a : []).includes(Number(item[0])) ?
                                                _jsx(Form.Control, { className: "field", type: "number", name: "units", step: ".01", onChange: function (e) { return props.handleUnits(String(item[0]), true, "add", props.newMenu, Number(e.target.value)); }, required: true }, i) :
                                                _jsx("div", {}, i);
                                        }) }))] })), _jsx(Row, __assign({ className: "form-actions", lg: 8 }, { children: _jsx(Button, __assign({ type: "submit", className: 'submit' }, { children: "Submit" })) }))] }) })) })] })));
}
export default MenuForm;
