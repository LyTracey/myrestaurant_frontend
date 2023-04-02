import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../style/menuForm.scss';


function MenuForm (props: any) {

    return (
        <Modal className="menu-form" show={props.addItem} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Menu Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e)}>
                    <Container>
                        <Form.Group className="title" as={Row} sm={2}>
                            <Form.Label column sm={3}>Title</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    required
                                    onChange={e => props.handleData(e.target.name, e.target.value)}>
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="description" as={Row} sm={2}>
                            <Form.Label column sm={3}>Description</Form.Label>
                            <Col sm={9}>
                                <Form.Control    
                                    type="text"
                                    name="description"
                                    onChange={e => props.handleData(e.target.name, e.target.value)}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="price" as={Row} sm={2}>
                            <Form.Label column sm={3}>Price</Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    onChange={e => props.handleData(e.target.name, Number(e.target.value))}
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
                                            type="checkbox"
                                            label={ item[1] }
                                            key={i}
                                            name="ingredients"
                                            value={ item[0] }
                                            onChange={e => props.handleUnits(Number(item[0]), e.target.checked)}
                                        />
                                    )
                                })}                    
                            </Col>
                            
                            <Col sm={2} className='units label'>
                                <Form.Label>Units</Form.Label>
                            </Col>
                            <Col sm={2} className='units multi-input'>
                                { Object.entries(props.ingredients).map((item, i) => 
                                    item[0] in props.newMenu.units ? 
                                        <Form.Control type="number" key={i} name="units" step=".01" onChange={e => props.handleUnits(item[0], true, Number(e.target.value))} required></Form.Control> : 
                                        <div key={i}></div>)}
                            </Col>
                        </Row>
                            

                        <Row className="submit" lg={8}>
                            <Button type="submit">Submit</Button>
                        </Row>
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default MenuForm;