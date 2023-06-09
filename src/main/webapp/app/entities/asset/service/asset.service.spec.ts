import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAsset, Asset } from '../asset.model';

import { AssetService } from './asset.service';

describe('Asset Service', () => {
  let service: AssetService;
  let httpMock: HttpTestingController;
  let elemDefault: IAsset;
  let expectedResult: IAsset | IAsset[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AssetService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Asset', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Asset()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Asset', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Asset', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Asset()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Asset', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Asset', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAssetToCollectionIfMissing', () => {
      it('should add a Asset to an empty array', () => {
        const asset: IAsset = { id: 123 };
        expectedResult = service.addAssetToCollectionIfMissing([], asset);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asset);
      });

      it('should not add a Asset to an array that contains it', () => {
        const asset: IAsset = { id: 123 };
        const assetCollection: IAsset[] = [
          {
            ...asset,
          },
          { id: 456 },
        ];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, asset);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Asset to an array that doesn't contain it", () => {
        const asset: IAsset = { id: 123 };
        const assetCollection: IAsset[] = [{ id: 456 }];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, asset);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asset);
      });

      it('should add only unique Asset to an array', () => {
        const assetArray: IAsset[] = [{ id: 123 }, { id: 456 }, { id: 66667 }];
        const assetCollection: IAsset[] = [{ id: 123 }];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, ...assetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const asset: IAsset = { id: 123 };
        const asset2: IAsset = { id: 456 };
        expectedResult = service.addAssetToCollectionIfMissing([], asset, asset2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asset);
        expect(expectedResult).toContain(asset2);
      });

      it('should accept null and undefined values', () => {
        const asset: IAsset = { id: 123 };
        expectedResult = service.addAssetToCollectionIfMissing([], null, asset, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asset);
      });

      it('should return initial array if no Asset is added', () => {
        const assetCollection: IAsset[] = [{ id: 123 }];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, undefined, null);
        expect(expectedResult).toEqual(assetCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
