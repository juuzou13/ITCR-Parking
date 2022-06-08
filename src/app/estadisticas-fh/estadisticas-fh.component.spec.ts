import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasFHComponent } from './estadisticas-fh.component';

describe('EstadisticasFHComponent', () => {
  let component: EstadisticasFHComponent;
  let fixture: ComponentFixture<EstadisticasFHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticasFHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticasFHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
