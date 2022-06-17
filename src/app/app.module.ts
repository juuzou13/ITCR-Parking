import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ChartsModule } from 'ng2-charts';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
// import { PostCreateComponent } from './posts/post-create/post-create.component';
// import { HeaderComponent } from './header/header.component';
// import { PostListComponent } from './posts/post-list/post-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RegistrarFuncionarioComponent } from './registrar-funcionario/registrar-funcionario.component';
import { MenuPrincipalAdminComponent } from './menu-principal-admin/menu-principal-admin.component';
import { MenuPrincipalFuncionarioComponent } from './menu-principal-funcionario/menu-principal-funcionario.component';
import { DescargaInformesComponent } from './descarga-informes/descarga-informes.component';
import { RegistrarVehiculoComponent } from './registrar-vehiculo/registrar-vehiculo.component';
import { RegistrarParqueoComponent } from './registrar-parqueo/registrar-parqueo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsultarParqueosComponent } from './consultar-parqueos/consultar-parqueos.component';
import { DialogoConfirmacionComponent } from './compartido/dialogo-confirmacion/dialogo-confirmacion.component';
import { DialogoInfoComponent } from './compartido/dialogo-info/dialogo-info.component';
import { ConsultarFuncionarioComponent } from './consultar-funcionario/consultar-funcionario.component';
// import { EditarCorreoComponent } from './editar-correo/editar-correo.component';
import { ManejoPlanillaComponent } from './manejo-planilla/manejo-planilla.component';
import { RegistroHorarioComponent } from './registro-horario/registro-horario.component';
import { EstadisticasFHComponent } from './estadisticas-fh/estadisticas-fh.component';
import { LogInComponent } from './log-in/log-in.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ReservaEspacioFuncionarioComponent } from './reserva-espacio-funcionario/reserva-espacio-funcionario.component';
import { ReservaEspacioVisitanteComponent } from './reserva-espacio-visitante/reserva-espacio-visitante.component';
import { ReservaEspacioVoficialComponent } from './reserva-espacio-voficial/reserva-espacio-voficial.component';
import { SimulacionLiberarEspaciosComponent } from './simulacion-liberar-espacios/simulacion-liberar-espacios.component';
import { LiberarEspaciosComponent } from './liberar-espacios/liberar-espacios.component';
import { VisualizarReservacionesComponent } from './visualizar-reservaciones/visualizar-reservaciones.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DetalleEstacionamientoComponent } from './detalle-estacionamiento/detalle-estacionamiento.component';
import { EstadisticasPorDepartamentoComponent } from './estadisticas-por-departamento/estadisticas-por-departamento.component';
import { EstadisticaEstacionamientoParticularComponent } from './estadistica-estacionamiento-particular/estadistica-estacionamiento-particular.component';
import { OcupacionPorDepartamentoComponent } from './ocupacion-por-departamento/ocupacion-por-departamento.component';
import { MenuPrincipalOperadorComponent } from './menu-principal-operador/menu-principal-operador.component';
import { RegistrarOperadorComponent } from './registrar-operador/registrar-operador.component';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    // PostCreateComponent,
    // HeaderComponent,
    // PostListComponent,
    RegistrarFuncionarioComponent,
    MenuPrincipalAdminComponent,
    MenuPrincipalFuncionarioComponent,
    DescargaInformesComponent,
    RegistrarVehiculoComponent,
    RegistrarParqueoComponent,
    ConsultarParqueosComponent,
    DialogoConfirmacionComponent,
    DialogoInfoComponent,
    ConsultarFuncionarioComponent,
    // EditarCorreoComponent,
    ManejoPlanillaComponent,
    RegistroHorarioComponent,
    EstadisticasFHComponent,
    LogInComponent,
    
    ReservaEspacioFuncionarioComponent,
    ReservaEspacioVisitanteComponent,
    SimulacionLiberarEspaciosComponent,
    LiberarEspaciosComponent,
    VisualizarReservacionesComponent,
    DetalleEstacionamientoComponent,
    EstadisticaEstacionamientoParticularComponent,
    OcupacionPorDepartamentoComponent,
    MenuPrincipalOperadorComponent,
    RegistrarOperadorComponent,
    ReservaEspacioVoficialComponent,
    EstadisticasPorDepartamentoComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatExpansionModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatGridListModule,
    ScrollingModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    MatButtonToggleModule,
    ChartsModule,
    FlexLayoutModule,
    NgApexchartsModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
