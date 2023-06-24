import { FormEvent, useState } from "react";
import '../../../styles/form.scss';
import Modal from "react-bootstrap/Modal";
import { ReadFieldGroup, 
    EditFieldGroup, 
    SelectMultiFieldGroup, 
    InputMultiFieldGroup, 
    DeleteAlert, 
    SubmitDelete, 
    ColumnsToRows } from "../../modules/formComponents";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

function OrderUpdateForm (props: any) {

    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);
    const [validated, setValidated] = useState(false);
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            props.handleSubmit(e, "update", props.updateOrder);
        }
        setValidated(true);
      };
    

    const Availability = (
        <>
            { Object.entries(props.menu).map((item: Array<any>, i) => {
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
        data: props.updateOrder, 
        reference: props.menu, 
        values_obj: "quantity", 
        items_list: "menu_items",
        setObj: props.setUpdateOrder
    });


    const Quantity = InputMultiFieldGroup({
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
    

    return (
        <Modal className={`orders-form page-form ${ props.theme }`} show={ props.updateItem } onHide={() => {
                setDeleteAlert(false);
                props.onHide();
                setValidated(false); 
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)}>
                    { 
                        ReadFieldGroup({
                            value: props.updateOrder.id, 
                            name: "id", 
                            label: "ID", 
                            type: "text"
                        }) 
                    }

                    { 
                        EditFieldGroup({
                            value: props.updateOrder.notes, 
                            name: "notes", 
                            label: "Notes", 
                            type: "text", 
                            dataHandler: props.handleData,
                            method: "update",
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
                        
                    { SubmitDelete(setDeleteAlert) }

                </Form>

                { deleteAlert && DeleteAlert(props.updateOrder, setDeleteAlert, props.handleSubmit) }
            </Modal.Body>
        </ Modal>
    )
};

export default OrderUpdateForm;