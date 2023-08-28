import { 
    useContext, 
    useRef,
    // FormEvent,
    // SetStateAction, 
    // Dispatch, 
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ICONS from '../../../data/icons';
import { GlobalContext } from '../App';
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
    ingredients: {[key: number]: string},
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
    ingredients: {},
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


    return (
        <Container className={`page menu ${ theme }`}>
            <Row className='title'>
                <h2 className="title">MENU</h2>
            </Row>

            {
                (user.isStaff && hasWriteAccess(user.role)) &&
                <Row xs={2} className='actions'>
                    <Button className="add button" onClick={() => navigate(internalEndpoints.menuCreate!)
                    }><AddMenu/> Add Menu</Button>
                </Row>
            }

            <Row xs={1} md={2} lg={3}>
                { menu.map((item: {[key: string]: any}, i: number) => {
                    return (
                        <Col key={`menu-item-${i}`} className="card-col">
                            <Card.Body onClick={() => {
                                    // Only render update form if user isStaff and has a role of MANAGER | CHEF
                                    if (user.isStaff && hasWriteAccess(user.role)) {       
                                        updateObj.current = {...MENU_OBJ, ...item};
                                        navigate( internalEndpoints.menuUpdate! );
                                    }
                                }} className={!user.isStaff ? "default-cursor" : ""}>
                                
                                <div className='card-image'>
                                    <ICONS.tea className="icon" />
                                </div>

                                <Card.Title as="div">
                                    <span className='title'>{ item.title }</span>
                                    <span>{ `£ ${ item.price }` }</span>
                                </Card.Title>

                                <div className='card-details'>
                                    <Card.Text>{ item.description }</Card.Text>
                                    <Card.Text className='ingredients'>Ingredients: { Object.values(item.ingredients).join(", ") }</Card.Text>
                                </div>
                            </Card.Body>
                        </Col>
                    )
                }) }
            </Row>
            
            {
                localStorage.getItem("access") && 
                <MenuContext.Provider value={ menuContextValue }>
                    <Outlet />
                </MenuContext.Provider>
            }

        </Container>
    )
};


export default Menu;