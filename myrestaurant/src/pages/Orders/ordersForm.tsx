import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../styles/menuForm.scss';

function OrdersForm (props: any) {

    return (
        <Modal className={`orders-form ${ props.theme }`} show={props.addItem} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>New Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e, "add", props.newOrder) }>
                    <Container>
                        <Form.Group className="field-group notes" as={Row} sm={2}>
                            <Form.Label column sm={3}>Notes</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control    
                                    type="text"
                                    name="notes"
                                    onChange={e => props.handleData(e.target.name, e.target.value, "add")}
                                    maxLength={150}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row sm={5} className="field-group menu-quantity">
                            <Col sm={3} className='menu-items label'>
                                <Form.Label>Menu Items</Form.Label>
                            </Col>

                            <Col as="fieldset" sm={4} className="menu-items multi-input">
                                { Object.entries(props.menu).map((item: any, i) => {
                                    return (
                                        <Form.Check
                                            className='field'
                                            key={i}
                                            type="checkbox"
                                            label={ item[1].title }
                                            name="is"
                                            value={ item[0] }
                                            required
                                            onChange={e => props.handleQuantity(String(item[0]), e.target.checked, "add", props.newOrder)}
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
                                <Form.Label>Quantity</Form.Label>
                            </Col>
                            <Col sm={2} className='quantity multi-input'>
                                { Object.entries(props.menu).map((item: any, i) => 
                                        (props.newOrder.menu_items ?? []).includes(Number(item[0])) ? 
                                            <Form.Control
                                                className="field"
                                                type="number" 
                                                key={i}
                                                name="quantity" 
                                                onChange={e => props.handleQuantity(String(item[0]), true, "add", props.newOrder, Number(e.target.value))} 
                                                required
                                                min={1}
                                                max={item[1].available_quantity}>
                                            </Form.Control>
                                            : 
                                            <div className="field" key={i}></div>)}
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