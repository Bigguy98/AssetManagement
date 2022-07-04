import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAssetType, AssetType } from '../asset-type.model';

import { AssetTypeService } from './asset-type.service';

describe('AssetType Service', () => {
  let service: AssetTypeService;
  let httpMock: HttpTestingController;
  let elemDefault: IAssetType;
  let expectedResult: IAssetType | IAssetType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AssetTypeService);
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

    it('should create a AssetType', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AssetType()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AssetType', () => {
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

    it('should partial update a AssetType', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
        },
        new AssetType()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AssetType', () => {
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

    it('should delete a AssetType', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAssetTypeToCollectionIfMissing', () => {
      it('should add a AssetType to an empty array', () => {
        const assetType: IAssetType = { id: 123 };
        expectedResult = service.addAssetTypeToCollectionIfMissing([], assetType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assetType);
      });

      it('should not add a AssetType to an array that contains it', () => {
        const assetType: IAssetType = { id: 123 };
        const assetTypeCollection: IAssetType[] = [
          {
            ...assetType,
          },
          { id: 456 },
        ];
        expectedResult = service.addAssetTypeToCollectionIfMissing(assetTypeCollection, assetType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AssetType to an array that doesn't contain it", () => {
        const assetType: IAssetType = { id: 123 };
        const assetTypeCollection: IAssetType[] = [{ id: 456 }];
        expectedResult = service.addAssetTypeToCollectionIfMissing(assetTypeCollection, assetType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assetType);
      });

      it('should add only unique AssetType to an array', () => {
        const assetTypeArray: IAssetType[] = [{ id: 123 }, { id: 456 }, { id: 99785 }];
        const assetTypeCollection: IAssetType[] = [{ id: 123 }];
        expectedResult = service.addAssetTypeToCollectionIfMissing(assetTypeCollection, ...assetTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const assetType: IAssetType = { id: 123 };
        const assetType2: IAssetType = { id: 456 };
        expectedResult = service.addAssetTypeToCollectionIfMissing([], assetType, assetType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assetType);
        expect(expectedResult).toContain(assetType2);
      });

      it('should accept null and undefined values', () => {
        const assetType: IAssetType = { id: 123 };
        expectedResult = service.addAssetTypeToCollectionIfMissing([], null, assetType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assetType);
      });

      it('should return initial array if no AssetType is added', () => {
        const assetTypeCollection: IAssetType[] = [{ id: 123 }];
        expectedResult = service.addAssetTypeToCollectionIfMissing(assetTypeCollection, undefined, null);
        expect(expectedResult).toEqual(assetTypeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
