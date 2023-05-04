import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../../styles/inventoryForm.scss";

function InventoryForm (props: any) {

    return (
        <Modal className={`inventory-form ${ props.theme }`} show={props.addItem} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Inventory Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e, "add", props.newInventory)}>
                    <Container>
                        <Form.Group className="field-group ingredient" as={Row} sm={2}>
                            <Form.Label column sm={3}>Ingredient</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control
                                    type="text"
                                    name="ingredient"
                                    required
                                    onChange={e => props.handleData(e.target.name, e.target.value, "add")}
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
                                    onChange={e => props.handleData(e.target.name, e.target.value, "add")}
                                    min={0}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="field-group unit_price" as={Row} sm={2}>
                            <Form.Label column sm={3}>Unit Price</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control 
                                    type="number"
                                    name="unit_price"
                                    step="0.01"
                                    required
                                    onChange={e => props.handleData(e.target.name, Number(e.target.value), "add")}
                                    min={0}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row className="form-actions" lg={8}>
                            <Button type="submit" className='submit'>Submit</Button>
                        </Row>
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default InventoryForm;