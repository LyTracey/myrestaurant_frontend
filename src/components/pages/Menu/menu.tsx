import { 
    useContext, 
    useRef,
    useMemo, 
    // FormEvent,
    // SetStateAction, 
    // Dispatch, 
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ReactComponent as CoffeeCup } from "../../../images/icons/coffee-cup.svg";
import { GlobalContext } from '../../App';
import { InventoryObj } from '../Inventory/inventory';
import "../../../styles/menu.scss";
import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import { createContext } from 'react';
import { internalEndpoints } from '../../../data/endpoints';
import { RiMenuAddFill as AddMenu } from "react-icons/ri";

// Access
const hasWriteAccess = (role: string) => {
    return ["MANAGER", "CHEF"].includes(role)
};


// Create form context

export const MenuContext = createContext<any>(null);

export interface MenuObj {
    id?: number | null,
    title: string | null,
    ingredients: Array<number>,
    units: {[key: string]: number | ""},
    image?: string | null,
    description: string,
    price: number | null,
    available_quantity?: number
};


// Default menu object
export const MENU_OBJ = {
    id: null,
    title: "",
    description: "",
    price: null,
    image: null,
    ingredients: [],
    units: {}
};


function Menu ( ) {
    // Unpack data from loader
    const [menu, inventory]: any = useLoaderData();
    
    // Form states
    const updateObj = useRef<MenuObj>(structuredClone(MENU_OBJ));
    const { theme: [theme], user: [user] } = useContext(GlobalContext);

    
    // Utils
    const navigate = useNavigate();
    const menuContextValue = {
        inventory: inventory,
        updateObj: updateObj
    };

    // Filter map inventory items to an object as id: title key-values when inventory state changes
    const ingredients: {[key: number]: string} = useMemo(() => {
        return Object.fromEntries(inventory.map((ingredient: InventoryObj) => (
            [ingredient.id, ingredient.ingredient]
        )))
    }, [inventory]);

    return (
        <Container className={`page menu ${ theme }`}>
            <Row className='title'>
                <h2>Menu</h2>
            </Row>

            {
                (user.isStaff && hasWriteAccess(user.role)) &&
                <Row xs={2} className='actions'>
                    <Button className="add" onClick={() => navigate("/menu/create")
                    }><AddMenu/> Add Menu</Button>
                </Row>
            }

            <Row xs={1} md={2} lg={3}>
                { menu.map((item: {[key: string]: any}, i: number) => {
                    return (
                        <Col key={`menu-item-${i}`}>
                            <Card.Body onClick={() => {
                                    // Only render update form if user isStaff and has a role of MANAGER | CHEF
                                    if (user.isStaff && hasWriteAccess(user.role)) {       
                                        updateObj.current = {...MENU_OBJ, ...item};
                                    }
                                    navigate( internalEndpoints.menuUpdate! );
                                }} className={!user.isStaff ? "default-cursor" : ""}>
                                <Card.Title>{ item.title }</Card.Title>
                                <CoffeeCup className="icon" />
                                <div className='card-details'>
                                    <Card.Text>{ item.description }</Card.Text>
                                    <Card.Text>{ `£ ${ item.price }` }</Card.Text>
                                    <Card.Text>Ingredients: { item.ingredients.map((index: number) => ingredients[index] ).join(", ") }</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>
            
            <MenuContext.Provider value={ menuContextValue }>
                <Outlet />
            </MenuContext.Provider>

        </Container>
    )
};


export default Menu;