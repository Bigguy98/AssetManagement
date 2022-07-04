import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'asset-type',
        data: { pageTitle: 'AssetTypes' },
        loadChildren: () => import('./asset-type/asset-type.module').then(m => m.AssetTypeModule),
      },
      {
        path: 'asset',
        data: { pageTitle: 'Assets' },
        loadChildren: () => import('./asset/asset.module').then(m => m.AssetModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'Customers' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
