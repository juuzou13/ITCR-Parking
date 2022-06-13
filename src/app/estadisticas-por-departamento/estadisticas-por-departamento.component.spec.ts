import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasPorDepartamentoComponent } from './estadisticas-por-departamento.component';

describe('EstadisticasPorDepartamentoComponent', () => {
  let component: EstadisticasPorDepartamentoComponent;
  let fixture: ComponentFixture<EstadisticasPorDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasPorDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasPorDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
