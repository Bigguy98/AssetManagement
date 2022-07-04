import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAsset, Asset } from '../asset.model';
import { AssetService } from '../service/asset.service';
import { IAssetType } from 'app/entities/asset-type/asset-type.model';
import { AssetTypeService } from 'app/entities/asset-type/service/asset-type.service';

@Component({
  selector: 'jhi-asset-update',
  templateUrl: './asset-update.component.html',
})
export class AssetUpdateComponent implements OnInit {
  isSaving = false;

  assetTypesSharedCollection: IAssetType[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    assetType: [],
  });

  constructor(
    protected assetService: AssetService,
    protected assetTypeService: AssetTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asset }) => {
      this.updateForm(asset);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const asset = this.createFromForm();
    if (asset.id !== undefined) {
      this.subscribeToSaveResponse(this.assetService.update(asset));
    } else {
      this.subscribeToSaveResponse(this.assetService.create(asset));
    }
  }

  trackAssetTypeById(_index: number, item: IAssetType): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAsset>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(asset: IAsset): void {
    this.editForm.patchValue({
      id: asset.id,
      name: asset.name,
      description: asset.description,
      assetType: asset.assetType,
    });

    this.assetTypesSharedCollection = this.assetTypeService.addAssetTypeToCollectionIfMissing(
      this.assetTypesSharedCollection,
      asset.assetType
    );
  }

  protected loadRelationshipsOptions(): void {
    this.assetTypeService
      .query()
      .pipe(map((res: HttpResponse<IAssetType[]>) => res.body ?? []))
      .pipe(
        map((assetTypes: IAssetType[]) =>
          this.assetTypeService.addAssetTypeToCollectionIfMissing(assetTypes, this.editForm.get('assetType')!.value)
        )
      )
      .subscribe((assetTypes: IAssetType[]) => (this.assetTypesSharedCollection = assetTypes));
  }

  protected createFromForm(): IAsset {
    return {
      ...new Asset(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      assetType: this.editForm.get(['assetType'])!.value,
    };
  }
}
