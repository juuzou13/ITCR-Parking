import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaEstacionamientoParticularComponent } from './estadistica-estacionamiento-particular.component';

describe('EstadisticaEstacionamientoParticularComponent', () => {
  let component: EstadisticaEstacionamientoParticularComponent;
  let fixture: ComponentFixture<EstadisticaEstacionamientoParticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticaEstacionamientoParticularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticaEstacionamientoParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
