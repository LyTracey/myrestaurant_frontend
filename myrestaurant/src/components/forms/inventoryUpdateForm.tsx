import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react';
import "../../style/inventoryForm.scss";


function InventoryUpdateForm (props: any) {

    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);

    return (
        <Modal className={`inventory-form ${ props.theme }`} show={props.updateItem} onHide={() => {
            setDeleteAlert(false);
            props.onHide();
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Update Inventory Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e, "update", props.updateInventory) }>
                    <Container>
                        <Form.Group className="field-group id" as={Row} sm={2}>
                            <Form.Label column sm={3}>ID</Form.Label>
                            <Col className="field" sm={9}>
                            <Form.Control
                                type="text"
                                name="id"
                                defaultValue={String(props.updateInventory.id) ?? 0}
                                readOnly
                                disabled
                            >                                
                            </Form.Control>
                        </Col>
                        </Form.Group>

                        <Form.Group className="field-group ingredient" as={Row} sm={2}>
                            <Form.Label column sm={3}>Ingredient</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    defaultValue={props.updateInventory.ingredient}
                                    readOnly
                                    disabled
                                    maxLength={100}
                                >
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="field-group quantity" as={Row} sm={2}>
                            <Form.Label column sm={3}>Quantity Available</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control    
                                    type="number"
                                    name="quantity"
                                    step="0.01"
                                    defaultValue={props.updateInventory.quantity}
                                    onChange={e => props.handleData(e.target.name, e.target.value, "update")}
                                    min={0}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="unit_price" as={Row} sm={2}>
                            <Form.Label column sm={3}>Unit Price</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control 
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    defaultValue={props.updateInventory.unit_price}
                                    onChange={e => props.handleData(e.target.name, Number(e.target.value), "update")}
                                    min={0}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row className="form-actions" lg={8}>
                            <Button type="submit" className="submit">Submit</Button>
                            <Button type="button" className="delete" onClick={() => setDeleteAlert(true)}>DELETE</Button>
                        </Row>
                    </Container>
                </Form>

                {   
                    deleteAlert &&
                    <Alert onClose={() => setDeleteAlert(false)} dismissible>
                        <Alert.Heading>
                            Are you sure you want to delete this item?
                        </Alert.Heading>
                        <div className='alert-actions'>
                            <Button type="button" className="cancel" onClick={() => setDeleteAlert(false) }>Cancel</Button>
                            <Button type="button" className="yes" onClick={(e) => {
                                props.handleSubmit(e, "delete", props.updateInventory);
                                setDeleteAlert(false);
                            }}>Yes</Button>
                        </div>
                    </Alert>
                }
            </Modal.Body>
        </Modal>
    )
}

export default InventoryUpdateForm;