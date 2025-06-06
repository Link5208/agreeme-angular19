export interface Contract {
  id: string;
  name: string;
  signDate: string;
  status: 'LIQUIDATED' | 'UNILIQUIDATED';
}
