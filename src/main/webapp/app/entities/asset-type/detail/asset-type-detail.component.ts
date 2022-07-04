import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAssetType } from '../asset-type.model';

@Component({
  selector: 'jhi-asset-type-detail',
  templateUrl: './asset-type-detail.component.html',
})
export class AssetTypeDetailComponent implements OnInit {
  assetType: IAssetType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assetType }) => {
      this.assetType = assetType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
