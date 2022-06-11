import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaEspacioVoficialComponent } from './reserva-espacio-voficial.component';

describe('ReservaEspacioVoficialComponent', () => {
  let component: ReservaEspacioVoficialComponent;
  let fixture: ComponentFixture<ReservaEspacioVoficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservaEspacioVoficialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaEspacioVoficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
