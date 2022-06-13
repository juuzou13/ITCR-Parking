import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarOperadorComponent } from './registrar-operador.component';

describe('RegistrarOperadorComponent', () => {
  let component: RegistrarOperadorComponent;
  let fixture: ComponentFixture<RegistrarOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarOperadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
