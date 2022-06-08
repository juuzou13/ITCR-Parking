import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuPrincipalFuncionarioComponent } from './menu-principal-funcionario.component';

describe('MenuPrincipalFuncionarioComponent', () => {
  let component: MenuPrincipalFuncionarioComponent;
  let fixture: ComponentFixture<MenuPrincipalFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuPrincipalFuncionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPrincipalFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
