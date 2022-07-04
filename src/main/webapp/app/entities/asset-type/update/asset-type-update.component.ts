import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAssetType, AssetType } from '../asset-type.model';
import { AssetTypeService } from '../service/asset-type.service';

@Component({
  selector: 'jhi-asset-type-update',
  templateUrl: './asset-type-update.component.html',
})
export class AssetTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
  });

  constructor(protected assetTypeService: AssetTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assetType }) => {
      this.updateForm(assetType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const assetType = this.createFromForm();
    if (assetType.id !== undefined) {
      this.subscribeToSaveResponse(this.assetTypeService.update(assetType));
    } else {
      this.subscribeToSaveResponse(this.assetTypeService.create(assetType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssetType>>): void {
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

  protected updateForm(assetType: IAssetType): void {
    this.editForm.patchValue({
      id: assetType.id,
      name: assetType.name,
      description: assetType.description,
    });
  }

  protected createFromForm(): IAssetType {
    return {
      ...new AssetType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
