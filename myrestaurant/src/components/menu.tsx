import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuForm from './forms/menuForm';
import MenuUpdateForm from './forms/menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../data/endpoints';
import { MenuObj, IngredientsObj } from '../types/menuTypes';
import "../style/menu.scss";
import slugify from 'slugify';


function Menu ( props: any ) {

    // Set states
    const menuObj = {
        id: null,
        title: "",
        description: "",
        price: null,
        ingredients: [],
        units: {}
    };

    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    const [ingredients, setIngredients] = useState<IngredientsObj>({});
    const [newMenu, setNewMenu] = useState<MenuObj>(menuObj);
    const [addItem, setAddItem] = useState<boolean>(false);
    const [updateMenu, setUpdateMenu ] = useState<MenuObj>(menuObj);
    const [updateItem, setUpdateItem] = useState<boolean>(false);
        
    // Define variables
    axios.defaults.headers.common['Authorization'] = "Token c5028653f703b10525ee32557069750b458b1e64";
    axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    
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
            // Return object of id as key and ingredient as value fields for each inventory item
            response.data.forEach((item: any) => (
                filteredInventory[item.id] = item.ingredient
            ));
            setIngredients(filteredInventory);
        }).catch(error => {
            console.log(error);
        })
    };

    // Fetch menu data and ingredients data on first load
    useEffect(() => {
       getMenu();
       getIngredients();
    }, []);

    // Update newMenu state
    const handleData = (item: string, value: string | number, method: "add" | "update") => {
        method === "add" ? setNewMenu({...newMenu, [item]: value}) : setUpdateMenu({...updateMenu, [item]: value})
    };
    
    // Update newMenu units and ingredients state
    const handleUnits = (item: string, checked: boolean=false, method: "add" | "update", data: MenuObj, value: number | ""="") => {
        let obj = {...data};
        if (checked) {
            obj.units[item] = value;
            if (!obj.ingredients.includes(Number(item))) {
                obj.ingredients = [...obj.ingredients, Number(item)];
            }
        } else {
            delete obj.units[item];
            obj.ingredients = obj.ingredients.filter(id => id !== Number(item));
        }
        method === "add" ? setNewMenu(obj) : setUpdateMenu(obj);
    };

    // Handle submit multipart form to backend
    const handleSubmit = async (e: any, method: "add" | "update" | "delete", data: MenuObj) => {
        e.preventDefault();
        const itemPath = `${endpoints.prefix}${endpoints["menu"]}${slugify(data.title ?? "")}/`;
        switch (method) {
            case "delete":
                await axios.delete( itemPath,
                ).then(() => {
                    console.log(`Successfully deleted ${data.title}`);
                    setUpdateItem(!updateItem);
                }).catch(error => 
                    console.log(error)
                );
                break;
            case "add":
                await axios.postForm(
                    `${endpoints.prefix}${endpoints["menu"]}`, {
                        title: newMenu.title,
                        description: newMenu.description,
                        price: newMenu.price,
                        "ingredients[]": newMenu.ingredients,
                        "units{}": newMenu.units
                    }, { formSerializer: { metaTokens: false, indexes: null }}
                ).then(() => {
                    setUpdateItem(!updateItem);
                    getMenu();
                }).catch(error => {
                    console.log(error);
                });
                break;
            case "update":
                axios.patchForm(itemPath, {
                    description: updateMenu.description,
                    price: updateMenu.price,
                    "ingredients[]": updateMenu.ingredients,
                    "units{}": updateMenu.units
                }, { formSerializer: { metaTokens: false, indexes: null }}
                ).then(() => {
                    setUpdateItem(!updateItem);
                    getMenu();
                }).catch(error => {
                    console.log(error);
                })
                break;
            default:
                console.log("Unrecognised method");  
        }  

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
                            <Card.Body onClick={() => {
                                    setUpdateMenu({...menuObj, ...item});
                                    setUpdateItem(!updateItem);
                                }}>
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

            <MenuUpdateForm 
                handleSubmit={ handleSubmit }
                updateItem={ updateItem }
                onHide={ () => setUpdateItem(false) }
                handleData={ handleData }
                handleUnits={ handleUnits }
                ingredients={ ingredients } 
                updateMenu={ updateMenu }
            />


        </Container>
    )
};


export default Menu;