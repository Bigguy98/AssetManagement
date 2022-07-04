import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AssetTypeService } from '../service/asset-type.service';

import { AssetTypeComponent } from './asset-type.component';

describe('AssetType Management Component', () => {
  let comp: AssetTypeComponent;
  let fixture: ComponentFixture<AssetTypeComponent>;
  let service: AssetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AssetTypeComponent],
    })
      .overrideTemplate(AssetTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssetTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AssetTypeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.assetTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
