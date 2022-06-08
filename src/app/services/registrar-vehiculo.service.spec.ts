import { TestBed } from '@angular/core/testing';

import { RegistrarVehiculoService } from './registrar-vehiculo.service';

describe('RegistrarVehiculoService', () => {
  let service: RegistrarVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarVehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
