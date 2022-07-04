import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AssetTypeComponent } from '../list/asset-type.component';
import { AssetTypeDetailComponent } from '../detail/asset-type-detail.component';
import { AssetTypeUpdateComponent } from '../update/asset-type-update.component';
import { AssetTypeRoutingResolveService } from './asset-type-routing-resolve.service';

const assetTypeRoute: Routes = [
  {
    path: '',
    component: AssetTypeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetTypeDetailComponent,
    resolve: {
      assetType: AssetTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetTypeUpdateComponent,
    resolve: {
      assetType: AssetTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetTypeUpdateComponent,
    resolve: {
      assetType: AssetTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(assetTypeRoute)],
  exports: [RouterModule],
})
export class AssetTypeRoutingModule {}
