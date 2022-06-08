import { TestBed } from '@angular/core/testing';

import { ConsultarParqueosService } from './consultar-parqueos.service';

describe('ConsultarParqueosService', () => {
  let service: ConsultarParqueosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultarParqueosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
