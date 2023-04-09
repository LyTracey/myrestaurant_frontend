import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react';
import '../../style/menuForm.scss';


function MenuUpdateForm (props: any) {

    // Set states
    const [deleteAlert, setDeleteAlert] = useState(false);

    return (
        <Modal className="menu-form" show={props.updateItem} onHide={() => {
            setDeleteAlert(false);
            props.onHide();
            }}>
            <Modal.Header closeButton>
                <Modal.Title>Update Menu Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => props.handleSubmit(e, "update", props.updateMenu) }>
                    <Container>
                        <Form.Group className="id" as={Row} sm={2}>
                            <Form.Label column sm={3}>ID</Form.Label>
                            <Col className="field" sm={9}>
                            <Form.Control
                                type="text"
                                name="id"
                                defaultValue={props.updateMenu.id}
                                readOnly
                                disabled
                            >                                
                            </Form.Control>
                        </Col>
                        </Form.Group>

                        <Form.Group className="title" as={Row} sm={2}>
                            <Form.Label column sm={3}>Title</Form.Label>
                            <Col className="field" sm={9}>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    defaultValue={props.updateMenu.title}
                                    readOnly
                                    disabled
                                >
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group className="description" as={Row} sm={2}>
                            <Form.Label column sm={3}>Description</Form.Label>
                            <Col sm={9}>
                                <Form.Control    
                                    type="text"
                                    name="description"
                                    defaultValue={props.updateMenu.description}
                                    onChange={e => props.handleData(e.target.name, e.target.value, "update")}
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
                                    defaultValue={props.updateMenu.price}
                                    onChange={e => props.handleData(e.target.name, Number(e.target.value), "update")}
                                ></Form.Control>
                            </Col>
                        </Form.Group>

                        <Row sm={4} className="ingredients-units">
                            <Col sm={3} className='ingredients label'>
                                <Form.Label>Ingredients</Form.Label>
                            </Col>

                            <Col sm={4} className="ingredients multi-input">
                                { Object.entries(props.ingredients).map((item: any, i) => {
                                    return (
                                        <Form.Check 
                                            type="checkbox"
                                            label={ item[1] }
                                            key={i}
                                            name="ingredients"
                                            value={ item[0] }
                                            checked={ props.updateMenu.ingredients.includes(Number(item[0])) }
                                            onChange={e => props.handleUnits(String(item[0]), e.target.checked, "update", props.updateMenu)}
                                        />
                                    )
                                })}                    
                            </Col>
                            
                            <Col sm={2} className='units label'>
                                <Form.Label>Units</Form.Label>
                            </Col>
                            <Col sm={3} className='units multi-input'>
                                { 
                                    Object.keys(props.ingredients).map((item: any, i) => {
                                            
                                        return (props.updateMenu.ingredients ?? []).includes(Number(item))
                                        ? <Form.Control 
                                                type="number" 
                                                key={i}
                                                name="units" 
                                                step=".01"
                                                value={ props.updateMenu.units[String(item)] }
                                                onChange={e => props.handleUnits(String(item), true, "update", props.updateMenu, Number(e.target.value))}
                                                required
                                            ></Form.Control>
                                        : <div key={i}></div>                                             
                                    })
                                }

                            </Col>
                        </Row>
                            

                        <Row className="submit" lg={8}>
                            <Button type="submit">Submit</Button>
                            <Button type="button" onClick={() => setDeleteAlert(true)}>DELETE</Button>
                        </Row>
                    </Container>
                </Form>

                {   
                    deleteAlert &&
                    <Alert onClose={() => setDeleteAlert(false)} dismissible>
                        <Alert.Heading>
                            Are you sure you want to delete this item?
                        </Alert.Heading>
                        <Button type="button" onClick={() => setDeleteAlert(false) }>Cancel</Button>
                        <Button type="button" onClick={(e) => {
                            props.handleSubmit(e, "delete", props.updateMenu);
                            setDeleteAlert(false);
                        }}>Yes</Button>
                    </Alert>
                }
            </Modal.Body>
        </Modal>
    )
}

export default MenuUpdateForm;