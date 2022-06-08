import { TestBed } from '@angular/core/testing';

import { RegistrarHorarioService } from './registrar-horario.service';

describe('RegistrarHorarioService', () => {
  let service: RegistrarHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
