import { TestBed } from '@angular/core/testing';

import { ManejoPlanillaService } from './manejo-planilla.service';

describe('ManejoPlanillaService', () => {
  let service: ManejoPlanillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManejoPlanillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
