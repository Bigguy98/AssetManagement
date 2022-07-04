import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AssetTypeService } from '../service/asset-type.service';
import { IAssetType, AssetType } from '../asset-type.model';

import { AssetTypeUpdateComponent } from './asset-type-update.component';

describe('AssetType Management Update Component', () => {
  let comp: AssetTypeUpdateComponent;
  let fixture: ComponentFixture<AssetTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assetTypeService: AssetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AssetTypeUpdateComponent],
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
      .overrideTemplate(AssetTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssetTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assetTypeService = TestBed.inject(AssetTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const assetType: IAssetType = { id: 456 };

      activatedRoute.data = of({ assetType });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(assetType));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AssetType>>();
      const assetType = { id: 123 };
      jest.spyOn(assetTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assetType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assetType }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(assetTypeService.update).toHaveBeenCalledWith(assetType);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AssetType>>();
      const assetType = new AssetType();
      jest.spyOn(assetTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assetType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: assetType }));
      saveSubject.complete();

      // THEN
      expect(assetTypeService.create).toHaveBeenCalledWith(assetType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AssetType>>();
      const assetType = { id: 123 };
      jest.spyOn(assetTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ assetType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assetTypeService.update).toHaveBeenCalledWith(assetType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
