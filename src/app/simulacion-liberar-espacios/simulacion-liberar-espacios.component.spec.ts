import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacionLiberarEspaciosComponent } from './simulacion-liberar-espacios.component';

describe('SimulacionLiberarEspaciosComponent', () => {
  let component: SimulacionLiberarEspaciosComponent;
  let fixture: ComponentFixture<SimulacionLiberarEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulacionLiberarEspaciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulacionLiberarEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
