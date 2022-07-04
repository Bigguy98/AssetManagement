import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAssetType } from '../asset-type.model';
import { AssetTypeService } from '../service/asset-type.service';
import { AssetTypeDeleteDialogComponent } from '../delete/asset-type-delete-dialog.component';

@Component({
  selector: 'jhi-asset-type',
  templateUrl: './asset-type.component.html',
})
export class AssetTypeComponent implements OnInit {
  assetTypes?: IAssetType[];
  isLoading = false;

  constructor(protected assetTypeService: AssetTypeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.assetTypeService.query().subscribe({
      next: (res: HttpResponse<IAssetType[]>) => {
        this.isLoading = false;
        this.assetTypes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAssetType): number {
    return item.id!;
  }

  delete(assetType: IAssetType): void {
    const modalRef = this.modalService.open(AssetTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.assetType = assetType;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
