import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPrincipalOperadorComponent } from './menu-principal-operador.component';

describe('MenuPrincipalOperadorComponent', () => {
  let component: MenuPrincipalOperadorComponent;
  let fixture: ComponentFixture<MenuPrincipalOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPrincipalOperadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPrincipalOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
