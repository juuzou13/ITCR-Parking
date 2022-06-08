import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarParqueoComponent } from './registrar-parqueo.component';

describe('RegistrarParqueoComponent', () => {
  let component: RegistrarParqueoComponent;
  let fixture: ComponentFixture<RegistrarParqueoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarParqueoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarParqueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
