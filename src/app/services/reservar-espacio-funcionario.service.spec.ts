import { TestBed } from '@angular/core/testing';

import { ReservarEspacioFuncionarioService } from './reservar-espacio-funcionario.service';

describe('ReservarEspacioFuncionarioService', () => {
  let service: ReservarEspacioFuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservarEspacioFuncionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
