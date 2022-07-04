import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AssetTypeDetailComponent } from './asset-type-detail.component';

describe('AssetType Management Detail Component', () => {
  let comp: AssetTypeDetailComponent;
  let fixture: ComponentFixture<AssetTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ assetType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AssetTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AssetTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load assetType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.assetType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
