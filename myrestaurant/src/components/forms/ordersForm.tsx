import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../style/menuForm.scss';
import { useState } from 'react';

function OrdersForm (props: any) {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e: any) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
    
        setValidated(true);
        props.handleSubmit(e, "add", props.newOrder);
    }};

    return (
        <Modal className={`orders-form ${ props.theme }`} show={props.addItem} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>New Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => handleSubmit(e)}
                    noValidate
                    validated={validated}>
                    <Container>
                        <Form.Group className="field-group notes" as={Row} sm={2}>
                            <Form.Label column sm={3}>Notes</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control    
                                    type="text"
                                    name="notes"
                                    onChange={e => props.handleData(e.target.name, e.target.value, "add")}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row sm={4} className="field-group menu-quantity">
                            <Col sm={3} className='menu-items label'>
                                <Form.Label>Menu Items</Form.Label>
                            </Col>

                            <Col sm={5} className="menu-items multi-input">
                                { Object.entries(props.menu).map((item: any, i) => {
                                    return (
                                        <Form.Check 
                                            className="field"
                                            type="checkbox"
                                            label={ item[1].title }
                                            key={i}
                                            name="is"
                                            value={ item[0] }
                                            onChange={e => props.handleQuantity(String(item[0]), e.target.checked, "add", props.newOrder)}
                                        />
                                    )
                                })}                    
                            </Col>
                            
                            <Col sm={2} className='quantity label'>
                                <Form.Label>Quantity</Form.Label>
                            </Col>
                            <Col sm={2} className='quantity multi-input'>
                                { Object.keys(props.menu).map((item, i) => 
                                        (props.newOrder.menu_items ?? []).includes(Number(item)) ? 
                                        <Form.Control 
                                            className="field"
                                            type="number" 
                                            key={i}
                                            name="quantity" 
                                            onChange={e => props.handleQuantity(String(item), true, "add", props.newOrder, Number(e.target.value))} 
                                            required>
                                        </Form.Control> : 
                                        <div key={i}></div>)}
                            </Col>
                        </Row>
                            
                        <Row className="form-actions" lg={8}>
                            <Button type="submit" className='submit'>Submit</Button>
                        </Row>
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default OrdersForm;