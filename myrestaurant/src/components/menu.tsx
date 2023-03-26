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
    const ingredients = ["Garlic", "Beef Mince", "Tomatoes"];

    // Set states
    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    const [newMenu, setNewMenu] = useState<MenuObj>({
        title: null,
        description: "",
        price: 0,
        ingredients: {}
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

    // Handle selected ingredients
    const handleSubmit = (e: any) => {
        e.preventDefault();
        e.target.ingredients.forEach((item: any) => console.log(item.value));
    };

    // Update menu
    const handleSelectedIngredients = (checked: boolean, item: string) => {
        let obj = {...newMenu};
        checked ? obj.ingredients[item] = 0 : delete obj.ingredients[item];
        setNewMenu(obj);
    };

    return (
        <Container className={`menu ${ props.theme }`}>
            <Row className='title justify-content-center'>
                <h2>Menu</h2>
            </Row>

            <Form onSubmit={e => handleSubmit(e)}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title"></Form.Control>
                </Form.Group>

                <Row xs={2}>
                    <Form.Group className='ingredients'>
                        <Form.Label>Ingredients</Form.Label>
                        { ingredients.map((item, i) => {
                            return (
                                <Form.Check 
                                    type="checkbox"
                                    label={ item }
                                    key={i}
                                    name="ingredients"
                                    value={ item }
                                    onChange={e => handleSelectedIngredients(e.target.checked, item)}
                                />
                            )
                        })}
                    </Form.Group>

                    <Form.Group className='units'>
                        <Form.Label>Units</Form.Label>
                        { ingredients.map((item, i) => item in newMenu.ingredients && <Form.Control type="number" key={i} name="units"></Form.Control> )}
                    </Form.Group>
                </Row>

                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        type="text"
                        name="description"
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type="number"
                        name="price"
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