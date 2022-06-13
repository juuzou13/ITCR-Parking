import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarReservacionesComponent } from './visualizar-reservaciones.component';

describe('VisualizarReservacionesComponent', () => {
  let component: VisualizarReservacionesComponent;
  let fixture: ComponentFixture<VisualizarReservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarReservacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarReservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
