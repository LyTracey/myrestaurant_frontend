import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuForm from './menuForm';
import MenuUpdateForm from './menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/menu.scss";
import slugify from 'slugify';
import placeholder from "../../images/placeholder-image.webp";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';

interface MenuObj {
    [index: string]: any,
    id?: number | null,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number | ""},
    image?: string | null,
    description: string,
    price: number | null,
    in_stock?: boolean,
    available_quantity?: number
};

interface IngredientsObj {
    [index: number]: string
};


function Menu ( props: any ) {

    // Set states
    const menuObj = {
        id: null,
        title: "",
        description: "",
        price: null,
        image: null,
        ingredients: [],
        units: {}
    };

    const [menu, setMenu] = useState<Array<MenuObj>>([]);
    const [ingredients, setIngredients] = useState<IngredientsObj>({});
    const [newMenu, setNewMenu] = useState<MenuObj>(menuObj);
    const [addItem, setAddItem] = useState<boolean>(false);
    const [updateMenu, setUpdateMenu ] = useState<MenuObj>(menuObj);
    const [updateItem, setUpdateItem] = useState<boolean>(false);
    
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
    const handleUnits = (item: string, checked: boolean=false, method: "add" | "update", data: MenuObj, value: number | "") => {
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
                    setUpdateItem(false);
                    getMenu();
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
                    setAddItem(false);
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
                    setUpdateItem(false);
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
        <Container className={`menu ${ useContext(ThemeContext) }`}>
            <Row className='title'>
                <h2>Menu</h2>
            </Row>
            
            <Row className='actions'>
                <Button onClick={() => setAddItem(!addItem)}>Add Item +</Button>
            </Row>

            <MenuForm
                handleSubmit={handleSubmit}
                handleData={handleData}
                handleUnits={handleUnits}
                ingredients={ingredients}
                newMenu={newMenu}
                addItem={addItem}
                onHide={() => setAddItem(false)}
                theme={ props.theme }
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
                                <Card.Img src={ item.image ?? placeholder } />
                                <div className='card-details'>
                                    <Card.Text>{ item.description }</Card.Text>
                                    <Card.Text>{ `£ ${ item.price }` }</Card.Text>
                                    <Card.Text>Ingredients: { item.ingredients.map(item => ingredients[item]).join(", ") }</Card.Text>
                                </div>
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
                theme={ props.theme }
            />
        </Container>
    )
};


export default Menu;