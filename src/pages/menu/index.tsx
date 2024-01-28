import { useContext } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import ICONS from "../../data/icons"
import { GlobalContext } from "../../App"
import "../../styles/menu.scss"
import { Outlet, useLoaderData, useNavigate } from "react-router-dom"
import { createContext, useMemo } from "react"
import { internalEndpoints } from "../../data/endpoints"
import { MenuType } from "./menu.types"

// Access
const hasWriteAccess = (role: string) => {
  return ["MANAGER", "CHEF"].includes(role)
}

// Create form context

export const MenuContext = createContext<any>(null)

function Menu() {
  // Unpack data from loader
  const [menu, inventory]: any = useLoaderData()

  // Map menu and inventory list into object
  const filteredMenu = useMemo<{ [key: number]: string }>(() => {
    return Object.fromEntries(
      menu.map((menuObj: MenuType) => [menuObj.id!, menuObj])
    )
  }, [menu])

  const filteredInventory = useMemo<{ [key: number]: string }>(
    () =>
      Object.fromEntries(
        inventory.map((inventoryObj: { [key: string]: any }) => [
          inventoryObj.id,
          inventoryObj.ingredient,
        ])
      ),
    [inventory]
  )

  const { TeaIcon, CreateIcon } = ICONS

  // Form states
  const {
    theme: [theme],
    user: [user],
  } = useContext(GlobalContext)

  // Utils
  const navigate = useNavigate()
  const menuContextValue = {
    inventory: filteredInventory,
    menu: filteredMenu,
  }

  return (
    <Container className={`page menu ${theme}`}>
      <Row className="title">
        <h2 className="title">MENU</h2>
      </Row>

      {user.isStaff && hasWriteAccess(user.role) && (
        <Row xs={2} className="actions">
          <Button
            title="Create new menu item"
            className="create button"
            onClick={() => navigate(internalEndpoints.menuCreate!)}
          >
            <CreateIcon className="icon" />
          </Button>
        </Row>
      )}

      <Row xs={1} md={2} lg={3}>
        {menu.map((item: { [key: string]: any }, i: number) => {
          return (
            <Col
              key={`menu-item-${i}`}
              className="card-col"
              title={`Click to edit ${item.title}.`}
            >
              <Card.Body
                onClick={() => {
                  // Only render update form if user isStaff and has a role of MANAGER | CHEF
                  if (user.isStaff && hasWriteAccess(user.role)) {
                    navigate(`${internalEndpoints.menuUpdateRoot!}/${item.id}`)
                  }
                }}
                className={!user.isStaff ? "default-cursor" : ""}
              >
                <div className="card-image">
                  <TeaIcon className="icon" />
                </div>

                <Card.Title as="div">
                  <span className="title">{item.title}</span>
                  <span className="price">{`£ ${item.price}`}</span>
                </Card.Title>

                <div className="card-details">
                  <div>{item.description}</div>
                  <div className="ingredients">
                    Ingredients: {Object.values(item.ingredients).join(", ")}
                  </div>
                </div>
              </Card.Body>
            </Col>
          )
        })}
      </Row>

      {localStorage.getItem("access") && (
        <MenuContext.Provider value={menuContextValue}>
          <Outlet />
        </MenuContext.Provider>
      )}
    </Container>
  )
}

export default Menu
