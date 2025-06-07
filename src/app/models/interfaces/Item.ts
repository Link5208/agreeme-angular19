export interface Item {
  id?: number | 0;
  itemId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  total?: number;
}
