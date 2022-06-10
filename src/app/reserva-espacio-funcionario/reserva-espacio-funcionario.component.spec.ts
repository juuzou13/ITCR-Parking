import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaEspacioFuncionarioComponent } from './reserva-espacio-funcionario.component';

describe('ReservaEspacioFuncionarioComponent', () => {
  let component: ReservaEspacioFuncionarioComponent;
  let fixture: ComponentFixture<ReservaEspacioFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaEspacioFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaEspacioFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
