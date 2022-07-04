import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAssetType } from '../asset-type.model';
import { AssetTypeService } from '../service/asset-type.service';

@Component({
  templateUrl: './asset-type-delete-dialog.component.html',
})
export class AssetTypeDeleteDialogComponent {
  assetType?: IAssetType;

  constructor(protected assetTypeService: AssetTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assetTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
