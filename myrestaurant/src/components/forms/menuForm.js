import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
function MenuForm(props) {
    return (_jsxs(Form, __assign({ className: "menu-form", onSubmit: function (e) { return props.handleSubmit(e); } }, { children: [_jsxs(Form.Group, __assign({ className: "title", as: Row, lg: 8 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3, lg: 2 }, { children: "Title" })), _jsx(Col, __assign({ className: "field", sm: 9, lg: 6 }, { children: _jsx(Form.Control, { type: "text", name: "title", required: true, onChange: function (e) { return props.handleData(e.target.name, e.target.value); } }) }))] })), _jsxs(Form.Group, __assign({ className: "description", as: Row, lg: 8 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3, lg: 2 }, { children: "Description" })), _jsx(Col, __assign({ sm: 9, lg: 6 }, { children: _jsx(Form.Control, { type: "text", name: "description", onChange: function (e) { return props.handleData(e.target.name, e.target.value); } }) }))] })), _jsxs(Form.Group, __assign({ className: "price", as: Row, lg: 8 }, { children: [_jsx(Form.Label, __assign({ column: true, sm: 3, lg: 2 }, { children: "Price" })), _jsx(Col, __assign({ sm: 9, lg: 6 }, { children: _jsx(Form.Control, { type: "number", name: "price", step: "0.01", required: true, onChange: function (e) { return props.handleData(e.target.name, Number(e.target.value)); } }) }))] })), _jsxs(Row, __assign({ sm: 4, lg: 6, className: "ingredients-units" }, { children: [_jsx(Col, __assign({ className: 'ingredients label' }, { children: _jsx(Form.Label, { children: "Ingredients" }) })), _jsx(Col, __assign({ lg: 2, className: "ingredients multi-input" }, { children: Object.entries(props.ingredients).map(function (item, i) {
                            return (_jsx(Form.Check, { type: "checkbox", label: item[1], name: "ingredients", value: item[0], onChange: function (e) { return props.handleUnits(Number(item[0]), e.target.checked); } }, i));
                        }) })), _jsx(Col, __assign({ className: 'units label' }, { children: _jsx(Form.Label, { children: "Units" }) })), _jsx(Col, __assign({ lg: 2, className: 'units multi-input' }, { children: Object.entries(props.ingredients).map(function (item, i) {
                            return item[0] in props.newMenu.units ?
                                _jsx(Form.Control, { type: "number", name: "units", step: ".01", onChange: function (e) { return props.handleUnits(item[0], true, Number(e.target.value)); }, required: true }, i) :
                                _jsx("div", {}, i);
                        }) }))] })), _jsx(Row, __assign({ className: "submit", lg: 8 }, { children: _jsx(Button, __assign({ type: "submit" }, { children: "Submit" })) }))] })));
}
export default MenuForm;
