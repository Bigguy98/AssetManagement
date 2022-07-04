import { IAssetType } from 'app/entities/asset-type/asset-type.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface IAsset {
  id?: number;
  name?: string | null;
  description?: string | null;
  assetType?: IAssetType | null;
  owners?: ICustomer[] | null;
}

export class Asset implements IAsset {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public assetType?: IAssetType | null,
    public owners?: ICustomer[] | null
  ) {}
}

export function getAssetIdentifier(asset: IAsset): number | undefined {
  return asset.id;
}
