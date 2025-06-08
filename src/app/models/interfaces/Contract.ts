import { ActionLog } from './ActionLog';
import { FileInfo } from './FileInfo';
import { Item } from './Item';

export interface Contract {
  id?: number;
  contractId?: string;
  name?: string;
  signDate?: string;
  status?: 'LIQUIDATED' | 'UNLIQUIDATED';
  items?: Item[];
  actionLogs?: ActionLog[];
  files?: FileInfo[];
  [key: string]: any;
}
