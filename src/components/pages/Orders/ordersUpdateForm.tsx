import { FormEvent, useState, useEffect, useRef, MouseEvent } from "react";
import '../../../styles/form.scss';
import Modal from "react-bootstrap/Modal";
import { 
    ReadFieldGroup, 
    EditFieldGroup2, 
    SelectMultiFieldGroup2, 
    InputMultiFieldGroup2, 
    DeleteAlert2, 
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

    // Field states
    const [menuItems, setMenuItems] = useState<Array<number>>([]);
    const quantity = useRef<{[key: string]: number | ""}>({});
    const notes = useRef<HTMLInputElement>(null);


    // Reset ingredients and units states when add dialogue is opened
    useEffect(() => {
        if (props.openForm === "update") {
            setMenuItems([...props.updateOrder.current.menu_items]);
            quantity.current = structuredClone(props.updateOrder.current.quantity);
        }
    }, [props.openForm]);


    const handleSubmit = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>, method: "update" | "delete") => {
        console.log(props.updateOrder.current.id);
        props.handleSubmit(e, method, {
            id: props.updateOrder.current.id,
            notes: notes.current!.value,
            "menu_items[]": menuItems,
            "quantity{}": Number(quantity.current),
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
        <Modal className={`orders-form page-form ${ props.theme }`} show={ props.openForm === "update" } onHide={() => {
                setDeleteAlert(false);
                props.onHide();
                setValidated(false); 
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={ validated } onSubmit={e => handleSubmit(e, "update")}>
                    { 
                        ReadFieldGroup({
                            value: props.updateOrder.current.id, 
                            name: "id", 
                            label: "ID", 
                            type: "text"
                        }) 
                    }

                    { 
                        EditFieldGroup2({
                            name: "notes", 
                            label: "Notes", 
                            type: "text", 
                            ref: notes,
                            defaultValue: props.updateOrder.current.notes,
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
                        
                        { ColumnsToRows([MenuItems, Quantity, Availability], {xs: [6, 3, 3]}) }
                    </Container>
                        
                    { SubmitDelete(setDeleteAlert) }

                </Form>

                { deleteAlert && DeleteAlert2(
                    (e: MouseEvent<HTMLElement>) => handleSubmit(e, "delete"),
                    () => setDeleteAlert(false)
                ) }
            </Modal.Body>
        </ Modal>
    )
};

export default OrderUpdateForm;