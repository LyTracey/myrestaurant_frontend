export interface InventoryType {
  [index: string]: any
  id?: number | null
  ingredient: string
  quantity: string
  unit_price: string | null
  threshold: number
}