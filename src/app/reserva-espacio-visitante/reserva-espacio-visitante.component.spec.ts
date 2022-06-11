import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaEspacioVisitanteComponent } from './reserva-espacio-visitante.component';

describe('ReservaEspacioVisitanteComponent', () => {
  let component: ReservaEspacioVisitanteComponent;
  let fixture: ComponentFixture<ReservaEspacioVisitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaEspacioVisitanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaEspacioVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
