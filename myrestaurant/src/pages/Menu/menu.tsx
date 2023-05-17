import { useState, useEffect } from 'react';
import { AxiosResponse, AxiosError } from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuCreateForm from './menuCreateForm';
import MenuUpdateForm from './menuUpdateForm';
import Button from 'react-bootstrap/Button';
import endpoints from '../../data/endpoints';
import "../../styles/menu.scss";
import slugify from 'slugify';
import {ReactComponent as CoffeeCup} from "../../images/icons/coffee-cup.svg";
import { useContext } from 'react';
import { ThemeContext } from '../Base/App';
import { dataAPI } from '../Base/App';

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
    [key: number]: any
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

    const theme = useContext(ThemeContext);
    
    // Fetch menu data from backend
    const getMenu = () => {
        dataAPI.get(
            `${endpoints["menu"]}`
        ).then((response: AxiosResponse) => {
            setMenu(response.data);
        }).catch((error: AxiosError) => {
            console.log(error);
        });
    };
    
    // Fetch ingredients from backend
    const getIngredients = () => {
        dataAPI.get(
            `${endpoints["inventory"]}`
        ).then((response: AxiosResponse) => {
            const filteredInventory: IngredientsObj = {};
            // Return object of id as key and ingredient as value fields for each inventory item
            response.data.forEach((item: any) => (
                filteredInventory[item.id] = {title: item.ingredient}
            ));
            setIngredients(filteredInventory);
        }).catch((error: AxiosError) => {
            console.log(error);
        });
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

    // Handle submit multipart form to backend
    const handleSubmit = async (e: any, method: "add" | "update" | "delete", data: MenuObj) => {
        e.preventDefault();
        const itemPath = `${endpoints["menu"]}${slugify(data.title ?? "")}/`;
        switch (method) {
            case "delete":
                await dataAPI.delete( itemPath,
                ).then(() => {
                    console.log(`Successfully deleted ${data.title}`);
                    setUpdateItem(false);
                    getMenu();
                }).catch((error: AxiosError) => 
                    console.log(error)
                );
                break;
            case "add":
                await dataAPI.post(
                    `${endpoints["menu"]}`, {
                        title: newMenu.title,
                        description: newMenu.description,
                        price: newMenu.price,
                        "ingredients[]": newMenu.ingredients,
                        "units{}": newMenu.units
                    }
                ).then(() => {
                    setAddItem(false);
                    getMenu();
                }).catch((error: AxiosError )=> {
                    console.log(error);
                });
                break;
            case "update":
                dataAPI.patch(itemPath, {
                    description: updateMenu.description,
                    price: updateMenu.price,
                    "ingredients[]": updateMenu.ingredients,
                    "units{}": updateMenu.units
                }).then(() => {
                    setUpdateItem(false);
                    getMenu();
                }).catch((error: AxiosError) => {
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

            {
                (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) &&
                <Row xs={2} className='actions'>
                    <Button className="add" onClick={() => {
                        setNewMenu({...menuObj});
                        setAddItem(!addItem);
                    }}>Add Item +</Button>
                </Row>
            }

            <MenuCreateForm
                theme={ theme }
                addItem={ addItem }
                onHide={() => setAddItem(false)}
                handleSubmit={ handleSubmit }
                newMenu={ newMenu }
                setNewMenu={ setNewMenu }
                handleData={handleData}
                ingredients={ ingredients }
            />

            <Row xs={1} md={2} lg={3}>
                { menu.map((item, i) => {
                    return (
                        <Col key={`menu-item-${i}`}>
                            <Card.Body onClick={() => {
                                    if (props.isStaff && ["MANAGER", "CHEF"].includes(props.role)) {        // Only render update form if user isStaff and has a role of MANAGER | CHEF
                                        setUpdateMenu({...menuObj, ...item});
                                        setUpdateItem(!updateItem);
                                    }
                                }} className={!props.isStaff ? "default-cursor" : ""}>
                                <Card.Title>{ item.title }</Card.Title>
                                <CoffeeCup className="icon" />
                                <div className='card-details'>
                                    <Card.Text>{ item.description }</Card.Text>
                                    <Card.Text>{ `£ ${ item.price }` }</Card.Text>
                                    <Card.Text>Ingredients: { item.ingredients.map(item => ingredients[item]["title"] ).join(", ") }</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>

            <MenuUpdateForm
                onHide={ () => setUpdateItem(false) }
                handleSubmit={ handleSubmit }
                updateItem={ updateItem }
                handleData={ handleData }
                theme={ theme }
                ingredients={ ingredients } 
                updateMenu={ updateMenu }
                setUpdateMenu={ setUpdateMenu }
            />
        </Container>
    )
};


export default Menu;