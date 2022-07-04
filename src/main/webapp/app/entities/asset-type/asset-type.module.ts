import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AssetTypeComponent } from './list/asset-type.component';
import { AssetTypeDetailComponent } from './detail/asset-type-detail.component';
import { AssetTypeUpdateComponent } from './update/asset-type-update.component';
import { AssetTypeDeleteDialogComponent } from './delete/asset-type-delete-dialog.component';
import { AssetTypeRoutingModule } from './route/asset-type-routing.module';

@NgModule({
  imports: [SharedModule, AssetTypeRoutingModule],
  declarations: [AssetTypeComponent, AssetTypeDetailComponent, AssetTypeUpdateComponent, AssetTypeDeleteDialogComponent],
  entryComponents: [AssetTypeDeleteDialogComponent],
})
export class AssetTypeModule {}
