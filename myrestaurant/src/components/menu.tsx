import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import { MenuObj } from '../types/menuTypes';
import "../style/menu.scss";

function Menu ( props: any ) {
    
    // Test ingredients
    const ingredients: {[key: number]: string} = {1: "Garlic", 10: "Beef Mince", 6: "Chives"};

    // Set states
    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    const [newMenu, setNewMenu] = useState<MenuObj>({
        title: "",
        description: "",
        ingredients: [],
        units: {},
        price: 0,
    });

    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    // Get menu data
    const getMenu = (method: string, data=null) => {
        axios({
            method: method,
            url: `${endpoints.prefix}${endpoints["menu"]}`,
            data: data
        }).then(response => {
            setMenu(response.data);
        }).catch(error => {
            console.log(error);
        })
    };

    // UseEffect
    useEffect(() => {
       getMenu("get");
    }, []);

    useEffect(() => {
        console.log(newMenu);
     }, [newMenu]);
    
    // Update data
    const handleData = (item: string, value: string | number) => {
        setNewMenu({...newMenu, [item]: value})
    };
    
    const handleUnits = (item: number, checked: boolean=false, value: number=0) => {
        let obj = {...newMenu};
        checked ? obj.units[item] = value : delete obj.units[item];
        setNewMenu(obj);
    };

    // Handle selected ingredients
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const selectedIngredients = Object.entries(newMenu.units).filter(item => item[1] > 0).map(item => Number(item[0]));
        setNewMenu({...newMenu, ingredients: selectedIngredients});
    };

    return (
        <Container className={`menu ${ props.theme }`}>
            <Row className='title justify-content-center'>
                <h2>Menu</h2>
            </Row>

            <Form onSubmit={e => handleSubmit(e)}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        required
                        onChange={e => handleData(e.target.name, e.target.value)}>
                    </Form.Control>
                </Form.Group>

                <Row xs={2}>
                    <Form.Group className='ingredients'>
                        <Form.Label>Ingredients</Form.Label>
                        { Object.entries(ingredients).map((item, i) => {
                            return (
                                <Form.Check 
                                    type="checkbox"
                                    label={ item[1] }
                                    key={i}
                                    name="ingredients"
                                    value={ item[0] }
                                    onChange={e => handleUnits(Number(item[0]), e.target.checked)}
                                />
                            )
                        })}
                    </Form.Group>

                    <Form.Group className='units'>
                        <Form.Label>Units</Form.Label>
                        { Object.entries(ingredients).map((item, i) => 
                            item[0] in newMenu.units ? 
                                <Form.Control type="number" key={i} name="units" step=".01" onChange={e => handleUnits(Number(item[0]), true, Number(e.target.value))} required></Form.Control> : 
                                <div key={i}></div>)}
                    </Form.Group>
                </Row>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        type="text"
                        name="description"
                        onChange={e => handleData(e.target.name, e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type="number"
                        name="price"
                        step=".01"
                        required
                        onChange={e => handleData(e.target.name, e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Button type="submit">Submit</Button>
            </Form>

            <Row>
                { menu.map((item, i) => {
                    return (
                        <Col key={`menu-item-${i}`}>
                            <Card.Body>
                                <Card.Title>{ item.title }</Card.Title>
                                <Card.Img src={ item.image } />
                                <Card.Text>{ item.description }</Card.Text>
                                <Card.Text>{ `£ ${ item.price }` }</Card.Text>
                                <Card.Text>{ `Ingredients: ${ item.ingredients }` }</Card.Text>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>


        </Container>
    )
};


export default Menu;