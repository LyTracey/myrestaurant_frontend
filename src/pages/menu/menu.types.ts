export interface MenuType {
  id?: number | null;
  title: string | null;
  ingredients: string[];
  units: { [key: string]: number };
  image?: string | null;
  description: string;
  price: number | null;
  available_quantity?: number;
}