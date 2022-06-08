import { TestBed } from '@angular/core/testing';

import { DescargarInformesService } from './descargar-informes.service';

describe('DescargarInformesService', () => {
  let service: DescargarInformesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescargarInformesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
