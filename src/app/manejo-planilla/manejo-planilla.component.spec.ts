import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManejoPlanillaComponent } from './manejo-planilla.component';

describe('ManejoPlanillaComponent', () => {
  let component: ManejoPlanillaComponent;
  let fixture: ComponentFixture<ManejoPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManejoPlanillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManejoPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
