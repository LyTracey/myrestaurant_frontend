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
    return (<Modal className={`menu-form form ${props.theme}`} show={props.updateItem} onHide={() => {
            setDeleteAlert(false);
            props.onHide();
            setValidated(false);
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>Update Menu Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>
                    {ReadFieldGroup({
            value: props.updateMenu.title,
            name: "title",
            label: "Title",
            type: "text"
        })}

                    {EditFieldGroup({
            value: props.updateMenu.description,
            name: "description",
            label: "Description",
            type: "text",
            dataHandler: props.handleData,
            method: "update",
            feedback: "Max character length is 300."
        }, {
            maxLength: 300,
        })}

                    {EditFieldGroup({
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
        })}

                    <Container className="multi-input-container">
                        <Row className="headers">
                            <Col xs={6}>Ingredients</Col>
                            <Col xs={6}>Units</Col>
                        </Row>

                        {ColumnsToRows([Ingredients, Units], { xs: [6, 6] })}
                    </Container>

                    {SubmitDelete(setDeleteAlert)}

                </Form>

                {deleteAlert && DeleteAlert(props.updateMenu, setDeleteAlert, props.handleSubmit)}

            </Modal.Body>
        </Modal>);
}
;
export default MenuUpdateForm;
