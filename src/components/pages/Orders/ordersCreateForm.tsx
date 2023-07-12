import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { 
    EditFieldGroup2, 
    SelectMultiFieldGroup2, 
    InputMultiFieldGroup2, 
    Submit, 
    ColumnsToRows } from '../../modules/formComponents';
import Container from "react-bootstrap/Container";
import "../../../styles/form.scss";
import { useState, FormEvent, useRef, useEffect } from 'react';

function OrdersCreateForm (props: any) {

    // Form states
    const [validated, setValidated] = useState(false);

    // Field states
    const [menuItems, setMenuItems] = useState<Array<number>>([]);
    const quantity = useRef<{[key: string]: number | ""}>({});
    const notes = useRef<HTMLInputElement>(null);


     // Reset ingredients and units states when add dialogue is opened
    useEffect(() => {
        if (props.openForm === "add") {
            setMenuItems([]);
            quantity.current = {};
        }
    }, [props.openForm]);


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        props.handleSubmit(e, "add", {
            notes: notes.current!.value ?? "",
            "menu_items[]": menuItems ?? [],
            "quantity{}": quantity.current,
        }, setValidated);
    };

    const Availability = (
        <>
            { Object.entries(props.availabilities).map((item: any, i: number) => {
                return (
                    <Form.Text as="div" className="multi-read-field availability" key={`availability_${i}`}>
                        { item[1] }
                    </Form.Text>
                )
            })}
        </>
    );


    const MenuItems = SelectMultiFieldGroup2({
        name: "menu-items",
        reference: props.menu, 
        state: menuItems,
        stateSetter: setMenuItems
    });


    const Quantity = InputMultiFieldGroup2({
        name: "quantity",
        reference: props.menu,  
        items_list: menuItems,
        ref: quantity,
        type: "number",
        feedback: "Quantity must be no more than the availability."
    }, {
        min: 1,
        max: props.availabilities
    });
    
    return (
        <Modal className={`orders-form page-form ${ props.theme }`} show={ props.openForm === "add" } onHide={() => {
            props.onHide();
            setValidated(false);  
        }}>
            
            <Modal.Header closeButton>
                <Modal.Title>New Order</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e)}>

                    { 
                        EditFieldGroup2({
                            name: "notes", 
                            label: "Notes", 
                            type: "text", 
                            ref: notes,
                            defaultValue: "",
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