import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEstacionamientoComponent } from './detalle-estacionamiento.component';

describe('DetalleEstacionamientoComponent', () => {
  let component: DetalleEstacionamientoComponent;
  let fixture: ComponentFixture<DetalleEstacionamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleEstacionamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleEstacionamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
