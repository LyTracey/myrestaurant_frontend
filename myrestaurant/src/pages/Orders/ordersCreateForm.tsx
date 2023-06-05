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

function OrdersCreateForm (props: any) {

    const [validated, setValidated] = useState(false);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            props.handleSubmit(e, "add", props.newOrder);
        }
        setValidated(true);
      };

    const Availability = (
        <>
            { Object.entries(props.menu).map((item: any, i) => {
                return (
                    <Form.Text as="div" className="multi-read-field availability" key={`availability_${i}`}>
                        { item[1].available_quantity }
                    </Form.Text>
                )
            })}
        </>
    );


    const MenuItems = SelectMultiFieldGroup({
        name: "menu-items",
        label: "Menu Items", 
        data: props.newOrder, 
        reference: props.menu, 
        values_obj: "quantity", 
        items_list: "menu_items",
        setObj: props.setNewOrder
    });


    const Quantity = InputMultiFieldGroup({
            name: "quantity",
            label: "Quantity", 
            type: "number",
            data: props.newOrder, 
            reference: props.menu, 
            values_obj: "quantity", 
            items_list: "menu_items",
            setObj: props.setNewOrder,
            feedback: "Quantity must be no more than the availability."
        }, {
            min: 1,
            max: props.availabilities
    });
    
    return (
        <Modal className={`orders-form page-form ${ props.theme }`} show={ props.addItem } onHide={() => {
            props.onHide();
            setValidated(false);  
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>New Order</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)}>

                    { 
                        EditFieldGroup({
                            value: props.newOrder.notes, 
                            name: "notes", 
                            label: "Notes", 
                            type: "text", 
                            dataHandler: props.handleData,
                            method: "add",
                            feedback: "Max character length is 200."
                        }, {
                            maxLength: 200
                        }) 
                    }

                    <Container className="multi-input-container">
                        <Row className="headers">
                            <Col xs={6}>Menu Items</Col>
                            <Col xs={3}>Quantity</Col>
                            <Col xs={3}>Availability</Col>
                        </Row>
                        
                        {
                            ColumnsToRows([MenuItems, Quantity, Availability], {xs: [6, 3, 3]})   
                        }
                    </Container>
                    
                    { Submit() }

                </Form>
            </Modal.Body>
        </Modal>

    )

};

export default OrdersCreateForm;