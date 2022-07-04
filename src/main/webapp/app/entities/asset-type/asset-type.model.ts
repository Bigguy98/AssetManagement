import { IAsset } from 'app/entities/asset/asset.model';

export interface IAssetType {
  id?: number;
  name?: string | null;
  description?: string | null;
  assets?: IAsset[] | null;
}

export class AssetType implements IAssetType {
  constructor(public id?: number, public name?: string | null, public description?: string | null, public assets?: IAsset[] | null) {}
}

export function getAssetTypeIdentifier(assetType: IAssetType): number | undefined {
  return assetType.id;
}
