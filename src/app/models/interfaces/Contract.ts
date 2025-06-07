import { Item } from './Item';

export interface Contract {
  id?: number;
  contractId: string;
  name: string;
  signDate: string;
  status?: 'LIQUIDATED' | 'UNLIQUIDATED';
  items: Item[];
}
