import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarFuncionarioComponent } from './consultar-funcionario.component';

describe('ConsultarFuncionarioComponent', () => {
  let component: ConsultarFuncionarioComponent;
  let fixture: ComponentFixture<ConsultarFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
