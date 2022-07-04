import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomer, Customer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { IAsset } from 'app/entities/asset/asset.model';
import { AssetService } from 'app/entities/asset/service/asset.service';

@Component({
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;

  assetsSharedCollection: IAsset[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    dateOfBirth: [],
    address: [],
    bankAccount: [],
    assets: [],
  });

  constructor(
    protected customerService: CustomerService,
    protected assetService: AssetService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.updateForm(customer);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id !== undefined) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  trackAssetById(_index: number, item: IAsset): number {
    return item.id!;
  }

  getSelectedAsset(option: IAsset, selectedVals?: IAsset[]): IAsset {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomer>>): void {
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

  protected updateForm(customer: ICustomer): void {
    this.editForm.patchValue({
      id: customer.id,
      name: customer.name,
      dateOfBirth: customer.dateOfBirth,
      address: customer.address,
      bankAccount: customer.bankAccount,
      assets: customer.assets,
    });

    this.assetsSharedCollection = this.assetService.addAssetToCollectionIfMissing(this.assetsSharedCollection, ...(customer.assets ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.assetService
      .query()
      .pipe(map((res: HttpResponse<IAsset[]>) => res.body ?? []))
      .pipe(
        map((assets: IAsset[]) => this.assetService.addAssetToCollectionIfMissing(assets, ...(this.editForm.get('assets')!.value ?? [])))
      )
      .subscribe((assets: IAsset[]) => (this.assetsSharedCollection = assets));
  }

  protected createFromForm(): ICustomer {
    return {
      ...new Customer(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      dateOfBirth: this.editForm.get(['dateOfBirth'])!.value,
      address: this.editForm.get(['address'])!.value,
      bankAccount: this.editForm.get(['bankAccount'])!.value,
      assets: this.editForm.get(['assets'])!.value,
    };
  }
}
