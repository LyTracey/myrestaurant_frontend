import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


function MenuForm (props: any) {

    return (
        <Form className="menu-form" onSubmit={e => props.handleSubmit(e)}>
                <Form.Group className="title" as={Row} lg={8}>
                    <Form.Label column sm={3} lg={2}>Title</Form.Label>
                    <Col className="field" sm={9} lg={6}>
                        <Form.Control
                            type="text"
                            name="title"
                            required
                            onChange={e => props.handleData(e.target.name, e.target.value)}>
                        </Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group className="description" as={Row} lg={8}>
                    <Form.Label column sm={3} lg={2}>Description</Form.Label>
                    <Col sm={9} lg={6}>
                        <Form.Control    
                            type="text"
                            name="description"
                            onChange={e => props.handleData(e.target.name, e.target.value)}
                        ></Form.Control>
                    </Col>
                </Form.Group>

                <Form.Group className="price" as={Row} lg={8}>
                    <Form.Label column sm={3} lg={2}>Price</Form.Label>
                    <Col sm={9} lg={6}>
                        <Form.Control 
                            type="number"
                            name="price"
                            step="0.01"
                            required
                            onChange={e => props.handleData(e.target.name, Number(e.target.value))}
                        ></Form.Control>
                    </Col>
                </Form.Group>

                <Row sm={4} lg={6} className="ingredients-units">
                    <Col className='ingredients label'>
                        <Form.Label>Ingredients</Form.Label>
                    </Col>

                    <Col lg={2} className="ingredients multi-input">
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
                    
                    <Col className='units label'>
                        <Form.Label>Units</Form.Label>
                    </Col>
                    <Col lg={2} className='units multi-input'>
                        { Object.entries(props.ingredients).map((item, i) => 
                            item[0] in props.newMenu.units ? 
                                <Form.Control type="number" key={i} name="units" step=".01" onChange={e => props.handleUnits(item[0], true, Number(e.target.value))} required></Form.Control> : 
                                <div key={i}></div>)}
                    </Col>
                </Row>
                    

                <Row className="submit" lg={8}>
                    <Button type="submit">Submit</Button>
                </Row>
            </Form>
    )
}

export default MenuForm;