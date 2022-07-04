import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AssetService } from '../service/asset.service';
import { IAsset, Asset } from '../asset.model';
import { IAssetType } from 'app/entities/asset-type/asset-type.model';
import { AssetTypeService } from 'app/entities/asset-type/service/asset-type.service';

import { AssetUpdateComponent } from './asset-update.component';

describe('Asset Management Update Component', () => {
  let comp: AssetUpdateComponent;
  let fixture: ComponentFixture<AssetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assetService: AssetService;
  let assetTypeService: AssetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AssetUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AssetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assetService = TestBed.inject(AssetService);
    assetTypeService = TestBed.inject(AssetTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AssetType query and add missing value', () => {
      const asset: IAsset = { id: 456 };
      const assetType: IAssetType = { id: 87040 };
      asset.assetType = assetType;

      const assetTypeCollection: IAssetType[] = [{ id: 58865 }];
      jest.spyOn(assetTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: assetTypeCollection })));
      const additionalAssetTypes = [assetType];
      const expectedCollection: IAssetType[] = [...additionalAssetTypes, ...assetTypeCollection];
      jest.spyOn(assetTypeService, 'addAssetTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      expect(assetTypeService.query).toHaveBeenCalled();
      expect(assetTypeService.addAssetTypeToCollectionIfMissing).toHaveBeenCalledWith(assetTypeCollection, ...additionalAssetTypes);
      expect(comp.assetTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const asset: IAsset = { id: 456 };
      const assetType: IAssetType = { id: 96176 };
      asset.assetType = assetType;

      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(asset));
      expect(comp.assetTypesSharedCollection).toContain(assetType);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asset>>();
      const asset = { id: 123 };
      jest.spyOn(assetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asset }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(assetService.update).toHaveBeenCalledWith(asset);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asset>>();
      const asset = new Asset();
      jest.spyOn(assetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asset }));
      saveSubject.complete();

      // THEN
      expect(assetService.create).toHaveBeenCalledWith(asset);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Asset>>();
      const asset = { id: 123 };
      jest.spyOn(assetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assetService.update).toHaveBeenCalledWith(asset);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAssetTypeById', () => {
      it('Should return tracked AssetType primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAssetTypeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
