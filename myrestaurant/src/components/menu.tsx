import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuForm from './forms/menuForm';
import endpoints from '../data/endpoints';
import Button from 'react-bootstrap/Button';
import { MenuObj, IngredientsObj } from '../types/menuTypes';
import "../style/menu.scss";


function Menu ( props: any ) {

    // Set states
    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    const [ingredients, setIngredients] = useState<IngredientsObj>({});
    const [newMenu, setNewMenu] = useState<MenuObj>({
        title: "",
        description: "",
        price: 0.00,
        ingredients: [],
        units: {},
    });
    const [addItem, setAddItem] = useState<boolean>(false);
    // const [updateMenu, setUpdateMenu ] = useState<MenuObj>({
        //     id: null,
        //     title: "",
        //     description: "",
        //     price: null,
        //     image: "",
        //     ingredients: [],
        //     units: {}
        // });
    
        
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    
    // Fetch menu data from backend
    const getMenu = () => {
        axios.get(
            `${endpoints.prefix}${endpoints["menu"]}`
        ).then(response => {
            setMenu(response.data);
        }).catch(error => {
            console.log(error);
        })
    };
    
    // Fetch ingredients from backend
    const getIngredients = () => {
        axios.get(
            `${endpoints.prefix}${endpoints["inventory"]}`
        ).then(response => {
            const filteredInventory: {[key: number]: string} = {};
            response.data.forEach((item: any) => (
                filteredInventory[item.id] = item.ingredient
            ));
            setIngredients(filteredInventory);
        }).catch(error => {
            console.log(error);
        })
    };

    // Fetch resources on first load
    useEffect(() => {
       getMenu();
       getIngredients();
    }, []);

    // Update data
    const handleData = (item: string, value: string | number) => {
        setNewMenu({...newMenu, [item]: value})
    };
    
    const handleUnits = (item: string | number, checked: boolean=false, value: number=0) => {
        let obj = {...newMenu};
        checked ? obj.units[item] = value : delete obj.units[item];
        setNewMenu(obj);
    };


    // Handle submit multipart form to backend
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const selectedIngredients = Object.entries(newMenu.units).filter(item => item[1] > 0).map(item => Number(item[0]));
        setNewMenu({...newMenu, ingredients: selectedIngredients});
        await axios.postForm(`${endpoints.prefix}${endpoints["menu"]}`, {
            title: newMenu.title,
            description: newMenu.description,
            price: newMenu.price,
            "ingredients[]": newMenu.ingredients,
            "units{}": newMenu.units,
        }, { formSerializer: { metaTokens: false, indexes: null }});
        getMenu();

    };

    return (
        <Container className={`menu ${ props.theme }`}>
            <Row className='title justify-content-center'>
                <h2>Menu</h2>
            </Row>
            
            <Button onClick={() => setAddItem(!addItem)}>Add Item +</Button>

            
            <MenuForm 
                handleSubmit={handleSubmit}
                handleData={handleData}
                handleUnits={handleUnits}
                ingredients={ingredients}
                newMenu={newMenu}
                addItem={addItem}
                onHide={() => setAddItem(false)}
            />

            <Row xs={1} md={2} lg={3}>
                { menu.map((item, i) => {
                    return (
                        <Col key={`menu-item-${i}`}>
                            <Card.Body>
                                <Card.Title>{ item.title }</Card.Title>
                                <Card.Img src={ item.image } />
                                <Card.Text>{ item.description }</Card.Text>
                                <Card.Text>{ `£ ${ item.price }` }</Card.Text>
                                <Card.Text>Ingredients: { item.ingredients.map(item => ingredients[item]).join(", ") }</Card.Text>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>


        </Container>
    )
};


export default Menu;