import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAssetType, AssetType } from '../asset-type.model';
import { AssetTypeService } from '../service/asset-type.service';

@Injectable({ providedIn: 'root' })
export class AssetTypeRoutingResolveService implements Resolve<IAssetType> {
  constructor(protected service: AssetTypeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAssetType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((assetType: HttpResponse<AssetType>) => {
          if (assetType.body) {
            return of(assetType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AssetType());
  }
}
