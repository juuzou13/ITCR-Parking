import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberarEspaciosComponent } from './liberar-espacios.component';

describe('LiberarEspaciosComponent', () => {
  let component: LiberarEspaciosComponent;
  let fixture: ComponentFixture<LiberarEspaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiberarEspaciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiberarEspaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
