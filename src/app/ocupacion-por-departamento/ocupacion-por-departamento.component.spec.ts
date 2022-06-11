import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcupacionPorDepartamentoComponent } from './ocupacion-por-departamento.component';

describe('OcupacionPorDepartamentoComponent', () => {
  let component: OcupacionPorDepartamentoComponent;
  let fixture: ComponentFixture<OcupacionPorDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcupacionPorDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcupacionPorDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
