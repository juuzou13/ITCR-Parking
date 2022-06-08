import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaInformesComponent } from './descarga-informes.component';

describe('DescargaInformesComponent', () => {
  let component: DescargaInformesComponent;
  let fixture: ComponentFixture<DescargaInformesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargaInformesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargaInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
