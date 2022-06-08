import { TestBed } from '@angular/core/testing';

import { ConsultaFuncionarioService } from './consulta-funcionario.service';

describe('ConsultaFuncionarioService', () => {
  let service: ConsultaFuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaFuncionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
