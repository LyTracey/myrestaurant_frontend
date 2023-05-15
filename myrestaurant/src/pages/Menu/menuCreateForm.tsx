import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { 
    EditFieldGroup, 
    SelectMultiFieldGroup, 
    InputMultiFieldGroup, 
    Submit, 
    ColumnsToRows } from '../Forms/formComponents';
import Container from "react-bootstrap/Container";
import "../../styles/form.scss";
import { useState, FormEvent } from 'react';

function MenuCreateForm (props: any) {

    // Set states
    const [validated, setValidated] = useState(false);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            props.handleSubmit(e, "add", props.newMenu);
        }
        setValidated(true);
      };

    const Ingredients = SelectMultiFieldGroup({
        name: "ingredients",
        label: "Ingredients", 
        data: props.newMenu, 
        reference: props.ingredients, 
        values_obj: "units", 
        items_list: "ingredients",
        setObj: props.setNewMenu
    });

    const Units = InputMultiFieldGroup({
        name: "units",
        label: "Units", 
        type: "number",
        data: props.newMenu, 
        reference: props.ingredients, 
        values_obj: "units", 
        items_list: "ingredients",
        setObj: props.setNewMenu,
        feedback: "Unit must be greater than 0.01."
    }, {
        min: 0.01,
        required: true,
        step: "0.01"
});

    return (
        <Modal className={`menu-form form ${ props.theme }`} show={ props.addItem } onHide={() => {
            props.onHide();
            setValidated(false); 
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>New Menu Item</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)} >
                    { 
                        EditFieldGroup({
                            value: props.newMenu.title, 
                            name: "title", 
                            label: "Title*", 
                            type: "text", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true
                        }) 
                    }

                    { 
                        EditFieldGroup({
                            value: props.newMenu.description, 
                            name: "description", 
                            label: "Description", 
                            type: "text", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Max character length is 300."
                        }, {
                            maxLength: 300,
                        }) 
                    }

                    { 
                        EditFieldGroup({
                            value: props.newMenu.price, 
                            name: "price", 
                            label: "Price*", 
                            type: "number", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Required. Max character length is 100."
                        }, {
                            maxLength: 100,
                            required: true,
                            min: 0,
                            step: "0.01"
                        }) 
                    }

                    <Container className="multi-input-container">
                        <Row className="headers">
                            <Col xs={6}>Ingredients</Col>
                            <Col xs={6}>Units</Col>
                        </Row>

                        { ColumnsToRows([Ingredients, Units], {xs: [6, 6]}) }
                    </Container>

                    { Submit() }
                </Form>
            </Modal.Body>
        </Modal>
    )

};

export default MenuCreateForm;