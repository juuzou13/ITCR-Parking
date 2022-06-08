import { TestBed } from '@angular/core/testing';

import { RegistrarParqueoService } from './registrar-parqueo.service';

describe('RegistrarParqueoService', () => {
  let service: RegistrarParqueoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarParqueoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
