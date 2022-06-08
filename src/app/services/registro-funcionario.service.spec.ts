import { TestBed } from '@angular/core/testing';

import { RegistroFuncionarioService } from './registro-funcionario.service';

describe('RegistroFuncionarioService', () => {
  let service: RegistroFuncionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroFuncionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
