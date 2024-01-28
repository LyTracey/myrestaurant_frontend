import { useContext, createContext, useMemo } from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import { NavLink, useNavigate } from "react-router-dom"
import { ReactComponent as CoffeeBeans } from "../../assets/icons/coffee-beans.svg"
import "../../styles/inventory.scss"
import { GlobalContext } from "../../App"
import { Outlet } from "react-router-dom"
import { useLoaderData } from "react-router-dom"
import { internalEndpoints } from "../../data/endpoints"
import { InventoryType } from "./inventory.types"
import { Tooltip } from "@mui/material"
import ICONS from "../../data/icons"

export const InventoryContext = createContext<any>(null)

function Inventory() {
  // Unpack loader data
  const [inventory, stockData]: any = useLoaderData()

  // Map inventory list into object
  const filteredInventory = useMemo<{ [key: number]: string }>(() => {
    return Object.fromEntries(
      inventory.map((inventoryObj: InventoryType) => [
        inventoryObj.id!,
        inventoryObj,
      ])
    )
  }, [inventory])

  // Utils
  const navigate = useNavigate()
  const { CreateIcon } = ICONS

  // Form states
  const {
    theme: [theme],
  } = useContext(GlobalContext)

  // Context value
  const inventoryContextValue = {
    inventory: filteredInventory,
  }

  return (
    <Container className={`page inventory ${theme}`}>
      <Row className="title">
        <h2 className="title">Inventory</h2>
      </Row>

      <Row className="actions">
        <NavLink
          className="button create"
          to={internalEndpoints.inventoryCreate!}
        >
          <CreateIcon className="icon" />
        </NavLink>
      </Row>

      <Row xs={1} md={2} lg={4}>
        {inventory.map((item: InventoryType, i: number) => {
          return (
            <Col key={`inventory-item-${i}`}>
              <Card.Body
                onClick={() => {
                  navigate(
                    `${internalEndpoints.inventoryUpdateRoot!}/${item.id}`
                  )
                }}
              >
                <Tooltip
                  title={
                    item.quantity === "0.00"
                      ? "Out-of-stock!"
                      : stockData.low_stock.includes(item.ingredient)
                      ? "Low-stock"
                      : "In-stock :)"
                  }
                >
                  <span
                    className={`quantity ${
                      item.quantity === "0.00"
                        ? "out-of-stock"
                        : stockData.low_stock.includes(item.ingredient)
                        ? "low-stock"
                        : "in-stock"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </Tooltip>
                <Card.Title>{item.ingredient}</Card.Title>
                <CoffeeBeans className="icon" />

                <div className="card-details">
                  <Card.Text>
                    <span>Unit Price:</span> {`£${item.unit_price}`}
                  </Card.Text>
                </div>
              </Card.Body>
            </Col>
          )
        })}
      </Row>

      <InventoryContext.Provider value={inventoryContextValue}>
        <Outlet />
      </InventoryContext.Provider>
    </Container>
  )
}

export default Inventory
