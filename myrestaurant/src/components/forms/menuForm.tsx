import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../style/menuForm.scss';

function MenuForm (props: any) {

    return (
        <Modal className={`menu-form ${ props.theme }`} show={props.addItem} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Menu Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e, "add", props.newMenu)}>
                    <Container>
                        <Form.Group className="title" as={Row} sm={2}>
                            <Form.Label column sm={3}>Title</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    required
                                    onChange={e => props.handleData(e.target.name, e.target.value, "add")}
                                >
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="description" as={Row} sm={2}>
                            <Form.Label column sm={3}>Description</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control    
                                    type="text"
                                    name="description"
                                    onChange={e => props.handleData(e.target.name, e.target.value, "add")}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="price" as={Row} sm={2}>
                            <Form.Label column sm={3}>Price</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control 
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    onChange={e => props.handleData(e.target.name, Number(e.target.value), "add")}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row sm={4} className="ingredients-units">
                            <Col sm={3} className='ingredients label'>
                                <Form.Label>Ingredients</Form.Label>
                            </Col>

                            <Col sm={5} className="ingredients multi-input">
                                { Object.entries(props.ingredients).map((item: any, i) => {
                                    return (
                                        <Form.Check 
                                            className="field"
                                            type="checkbox"
                                            label={ item[1] }
                                            key={i}
                                            name="ingredients"
                                            value={ item[0] }
                                            onChange={e => props.handleUnits(String(item[0]), e.target.checked, "add", props.newMenu)}
                                        />
                                    )
                                })}                    
                            </Col>
                            
                            <Col sm={2} className='units label'>
                                <Form.Label>Units</Form.Label>
                            </Col>
                            <Col sm={2} className='units multi-input'>
                                { Object.entries(props.ingredients).map((item, i) => 
                                    (props.newMenu.ingredients ?? []).includes(Number(item[0])) ? 
                                        <Form.Control 
                                            className="field"
                                            type="number" 
                                            key={i} 
                                            name="units" 
                                            step=".01" 
                                            onChange={e => props.handleUnits(String(item[0]), true, "add", props.newMenu, Number(e.target.value))} 
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

export default MenuForm;