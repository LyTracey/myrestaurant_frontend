import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react';
import '../../style/menuForm.scss';


function OrderUpdateForm (props: any) {

    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);

    return (
        <Modal className={`orders-form ${ props.theme }`} show={props.updateItem} onHide={() => {
            setDeleteAlert(false);
            props.onHide();
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Update Order Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e, "update", props.updateOrder) }>
                    <Container>
                        <Form.Group className="field-group id" as={Row} sm={2}>
                            <Form.Label column sm={3}>ID</Form.Label>
                            <Col className="field" sm={9}>
                            <Form.Control
                                type="text"
                                name="id"
                                defaultValue={props.updateOrder.id}
                                readOnly
                                disabled
                            >                                
                            </Form.Control>
                        </Col>
                        </Form.Group>

                        <Form.Group className="field-group notes" as={Row} sm={2}>
                            <Form.Label column sm={3}>Notes</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control 
                                    type="text"
                                    name="notes"
                                    defaultValue={props.updateOrder.notes}
                                    onChange={e => props.handleData(e.target.name, e.target.value, "update")}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row sm={5} className="field-group menu-quantity">
                            <Col sm={3} className='menu-items label'>
                                <Form.Label>Menu Items</Form.Label>
                            </Col>

                            <Col as="fieldset" sm={3} className="menu-items multi-input">
                                { Object.entries(props.menu).map((item: any, i) => {
                                    return (
                                        <Form.Check
                                            className="field"
                                            key={i}
                                            type="checkbox"
                                            label={ item[1].title }
                                            name="menu_items"
                                            value={ item[0] }
                                            required
                                            checked={ props.updateOrder.menu_items.includes(Number(item[0])) }
                                            onChange={e => props.handleQuantity(String(item[0]), e.target.checked, "update", props.updateOrder)}
                                        />
                                    )
                                })}                    
                            </Col>

                            <Col as="fieldset" sm={1} className="menu-items availability">
                                { Object.entries(props.menu).map((item: any, i) => {
                                    return (
                                        <Form.Text as="div" className="field" key={i}>{item[1].available_quantity}</Form.Text>
                                    )
                                })}  
                            </Col>
                            
                            <Col sm={2} className='quantity label'>
                                <Form.Label>Units</Form.Label>
                            </Col>
                            <Col sm={3} className='quantity multi-input'>
                                { 
                                    Object.entries(props.menu).map((item: any, i) => {
                                            
                                        return (props.updateOrder.menu_items ?? []).includes(Number(item[0]))
                                        ? <Form.Control
                                                className="field"
                                                type="number" 
                                                key={i}
                                                name="quantity" 
                                                value={ props.updateOrder.quantity[String(item[0])] }
                                                onChange={e => props.handleQuantity(String(item[0]), true, "update", props.updateOrder, Number(e.target.value))}
                                                required
                                                min={1}
                                                max={item[1].available_quantity}
                                            ></Form.Control>
                                        : <div className="field" key={i}></div>                                             
                                    })
                                }

                            </Col>
                        </Row>
                            

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
                                props.handleSubmit(e, "delete", props.updateOrder);
                                setDeleteAlert(false);
                            }}>Yes</Button>
                        </div>
                    </Alert>
                }
            </Modal.Body>
        </Modal>
    )
}

export default OrderUpdateForm;