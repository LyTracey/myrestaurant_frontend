import { __assign } from "tslib";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import '../../styles/form.scss';
import Modal from "react-bootstrap/Modal";
import { ReadFieldGroup, EditFieldGroup, SelectMultiFieldGroup, InputMultiFieldGroup, DeleteAlert, SubmitDelete, ColumnsToRows } from "../Forms/formComponents";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";
function OrderUpdateForm(props) {
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
            props.handleSubmit(e, "update", props.updateOrder);
        }
        setValidated(true);
    };
    var Availability = (_jsx(_Fragment, { children: Object.entries(props.menu).map(function (item, i) {
            return (_jsx(Form.Text, __assign({ as: "div", className: "multi-read-field availability" }, { children: item[1].available_quantity }), "availability_".concat(i)));
        }) }));
    var MenuItems = SelectMultiFieldGroup({
        name: "menu-items",
        label: "Menu Items",
        data: props.updateOrder,
        reference: props.menu,
        values_obj: "quantity",
        items_list: "menu_items",
        setObj: props.setUpdateOrder
    });
    var Quantity = InputMultiFieldGroup({
        name: "quantity",
        label: "Quantity",
        type: "number",
        data: props.updateOrder,
        reference: props.menu,
        values_obj: "quantity",
        items_list: "menu_items",
        setObj: props.setUpdateOrder,
        feedback: "Quantity must be no more than the availability."
    }, {
        min: 1,
        max: props.availabilities
    });
    return (_jsxs(Modal, __assign({ className: "orders-form form ".concat(props.theme), show: props.updateItem, onHide: function () {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false);
        } }, { children: [_jsx(Modal.Header, __assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Order" }) })), _jsxs(Modal.Body, { children: [_jsxs(Form, __assign({ noValidate: true, validated: validated, onSubmit: function (e) { return handleSubmit(e); } }, { children: [ReadFieldGroup({
                                value: props.updateOrder.id,
                                name: "id",
                                label: "ID",
                                type: "text"
                            }), EditFieldGroup({
                                value: props.updateOrder.notes,
                                name: "notes",
                                label: "Notes",
                                type: "text",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Max character length is 200."
                            }, {
                                maxLength: 200
                            }), _jsxs(Container, __assign({ className: "multi-input-container" }, { children: [_jsxs(Row, __assign({ className: "headers" }, { children: [_jsx(Col, __assign({ xs: 6 }, { children: "Menu Items" })), _jsx(Col, __assign({ xs: 3 }, { children: "Quantity" })), _jsx(Col, __assign({ xs: 3 }, { children: "Availability" }))] })), ColumnsToRows([MenuItems, Quantity, Availability], { xs: [6, 3, 3] })] })), SubmitDelete(setDeleteAlert)] })), deleteAlert && DeleteAlert(props.updateOrder, setDeleteAlert, props.handleSubmit)] })] })));
}
;
export default OrderUpdateForm;
