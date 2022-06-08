import { TestBed } from '@angular/core/testing';

import { EstadisticasFhService } from './estadisticas-fh.service';

describe('EstadisticasFhService', () => {
  let service: EstadisticasFhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticasFhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
