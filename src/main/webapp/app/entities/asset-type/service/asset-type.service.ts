import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssetType, getAssetTypeIdentifier } from '../asset-type.model';

export type EntityResponseType = HttpResponse<IAssetType>;
export type EntityArrayResponseType = HttpResponse<IAssetType[]>;

@Injectable({ providedIn: 'root' })
export class AssetTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/asset-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(assetType: IAssetType): Observable<EntityResponseType> {
    return this.http.post<IAssetType>(this.resourceUrl, assetType, { observe: 'response' });
  }

  update(assetType: IAssetType): Observable<EntityResponseType> {
    return this.http.put<IAssetType>(`${this.resourceUrl}/${getAssetTypeIdentifier(assetType) as number}`, assetType, {
      observe: 'response',
    });
  }

  partialUpdate(assetType: IAssetType): Observable<EntityResponseType> {
    return this.http.patch<IAssetType>(`${this.resourceUrl}/${getAssetTypeIdentifier(assetType) as number}`, assetType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAssetType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAssetType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAssetTypeToCollectionIfMissing(
    assetTypeCollection: IAssetType[],
    ...assetTypesToCheck: (IAssetType | null | undefined)[]
  ): IAssetType[] {
    const assetTypes: IAssetType[] = assetTypesToCheck.filter(isPresent);
    if (assetTypes.length > 0) {
      const assetTypeCollectionIdentifiers = assetTypeCollection.map(assetTypeItem => getAssetTypeIdentifier(assetTypeItem)!);
      const assetTypesToAdd = assetTypes.filter(assetTypeItem => {
        const assetTypeIdentifier = getAssetTypeIdentifier(assetTypeItem);
        if (assetTypeIdentifier == null || assetTypeCollectionIdentifiers.includes(assetTypeIdentifier)) {
          return false;
        }
        assetTypeCollectionIdentifiers.push(assetTypeIdentifier);
        return true;
      });
      return [...assetTypesToAdd, ...assetTypeCollection];
    }
    return assetTypeCollection;
  }
}
