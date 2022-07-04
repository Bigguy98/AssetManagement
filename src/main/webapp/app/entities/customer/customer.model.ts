import dayjs from 'dayjs/esm';
import { IAsset } from 'app/entities/asset/asset.model';

export interface ICustomer {
  id?: number;
  name?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
  address?: string | null;
  bankAccount?: string | null;
  assets?: IAsset[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public name?: string | null,
    public dateOfBirth?: dayjs.Dayjs | null,
    public address?: string | null,
    public bankAccount?: string | null,
    public assets?: IAsset[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
