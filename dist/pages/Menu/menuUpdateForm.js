import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { ReadFieldGroup, EditFieldGroup, SelectMultiFieldGroup, InputMultiFieldGroup, SubmitDelete, DeleteAlert, ColumnsToRows } from '../Forms/formComponents';
import Container from "react-bootstrap/Container";
import "../../styles/form.scss";
import { useState } from 'react';
function MenuUpdateForm(props) {
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
            props.handleSubmit(e, "update", props.updateMenu);
        }
        setValidated(true);
    };
    const Ingredients = SelectMultiFieldGroup({
        name: "ingredients",
        label: "Ingredients",
        data: props.updateMenu,
        reference: props.ingredients,
        values_obj: "units",
        items_list: "ingredients",
        setObj: props.setUpdateMenu
    });
    const Units = InputMultiFieldGroup({
        name: "units",
        label: "Units",
        type: "number",
        data: props.updateMenu,
        reference: props.ingredients,
        values_obj: "units",
        items_list: "ingredients",
        setObj: props.setupdateMenu,
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
    });
    return (_jsxs(Modal, Object.assign({ className: `menu-form page-form ${props.theme}`, show: props.updateItem, onHide: () => {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false);
        } }, { children: [_jsx(Modal.Header, Object.assign({ closeButton: true }, { children: _jsx(Modal.Title, { children: "Update Menu Item" }) })), _jsxs(Modal.Body, { children: [_jsxs(Form, Object.assign({ noValidate: true, validated: validated, onSubmit: e => handleSubmit(e) }, { children: [ReadFieldGroup({
                                value: props.updateMenu.title,
                                name: "title",
                                label: "Title",
                                type: "text"
                            }), EditFieldGroup({
                                value: props.updateMenu.description,
                                name: "description",
                                label: "Description",
                                type: "text",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Max character length is 300."
                            }, {
                                maxLength: 300,
                            }), EditFieldGroup({
                                value: props.updateMenu.price,
                                name: "price",
                                label: "Price*",
                                type: "number",
                                dataHandler: props.handleData,
                                method: "update",
                                feedback: "Required. Max character length is 100."
                            }, {
                                maxLength: 100,
                                required: true,
                                min: 0,
                                step: "0.01"
                            }), _jsxs(Container, Object.assign({ className: "multi-input-container" }, { children: [_jsxs(Row, Object.assign({ className: "headers" }, { children: [_jsx(Col, Object.assign({ xs: 6 }, { children: "Ingredients" })), _jsx(Col, Object.assign({ xs: 6 }, { children: "Units" }))] })), ColumnsToRows([Ingredients, Units], { xs: [6, 6] })] })), SubmitDelete(setDeleteAlert)] })), deleteAlert && DeleteAlert(props.updateMenu, setDeleteAlert, props.handleSubmit)] })] })));
}
;
export default MenuUpdateForm;
