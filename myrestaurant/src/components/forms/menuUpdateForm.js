import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../style/menuForm.scss';
function MenuUpdateForm(props) {
    return (_jsxs(Modal, __assign({ className: "menu-form", show: props.updateItem, onHide: props.onHide }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Menu Item" }) })), _jsx(Modal.Body, { children: _jsx(Form, __assign({ onSubmit: function (e) { return props.handleSubmit(e, "update", props.updateMenu); } }, { children: _jsxs(Container, { children: [_jsxs(Form.Group, __assign({ className: "id", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "ID" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "id", defaultValue: props.updateMenu.id, readOnly: true }) }))] })), _jsxs(Form.Group, __assign({ className: "title", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Title" })), _jsx(Col, __assign({ className: "field", sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "title", defaultValue: props.updateMenu.title, readOnly: true }) }))] })), _jsxs(Form.Group, __assign({ className: "description", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Description" })), _jsx(Col, __assign({ sm: 9 }, { children: _jsx(Form.Control, { type: "text", name: "description", defaultValue: props.updateMenu.description, onChange: function (e) { return props.handleData(e.target.name, e.target.value, "update"); } }) }))] })), _jsxs(Form.Group, __assign({ className: "price", as: Row, sm: 2 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3 }, { children: "Price" })), _jsx(Col, __assign({ sm: 9 }, { children: _jsx(Form.Control, { type: "number", name: "price", step: "0.01", required: true, defaultValue: props.updateMenu.price, onChange: function (e) { return props.handleData(e.target.name, Number(e.target.value), "update"); } }) }))] })), _jsxs(Row, __assign({ sm: 4, className: "ingredients-units" }, { children: [_jsx(Col, __assign({ sm: 3, className: 'ingredients label' }, { children: _jsx(Form.Label, { children: "Ingredients" }) })), _jsx(Col, __assign({ sm: 5, className: "ingredients multi-input" }, { children: Object.entries(props.ingredients).map(function (item, i) {
                                            return (_jsx(Form.Check, { type: "checkbox", label: item[1], name: "ingredients", value: item[0], onChange: function (e) { return props.handleUnits(Number(item[0]), e.target.checked, "update", props.updateMenu); } }, i));
                                        }) })), _jsx(Col, __assign({ sm: 2, className: 'units label' }, { children: _jsx(Form.Label, { children: "Units" }) })), _jsx(Col, __assign({ sm: 2, className: 'units multi-input' }, { children: Object.entries(props.ingredients).map(function (item, i) {
                                            var _a;
                                            return item[0] in ((_a = props.updateMenu.units) !== null && _a !== void 0 ? _a : [])
                                                ? (_jsx(Form.Control, { type: "number", name: "units", step: ".01", onChange: function (e) { return props.handleUnits(item[0], true, "update", props.updateMenu, Number(e.target.value)); }, required: true }, i))
                                                : _jsx("div", {}, i);
                                        }) }))] })), _jsx(Row, __assign({ className: "submit", lg: 8 }, { children: _jsx(Button, __assign({ type: "submit" }, { children: "Submit" })) }))] }) })) })] })));
}
export default MenuUpdateForm;
