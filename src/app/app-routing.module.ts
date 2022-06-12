import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConsultarParqueosComponent } from './consultar-parqueos/consultar-parqueos.component';
import { DescargaInformesComponent } from './descarga-informes/descarga-informes.component';
import { MenuPrincipalAdminComponent } from './menu-principal-admin/menu-principal-admin.component';
import { MenuPrincipalFuncionarioComponent } from './menu-principal-funcionario/menu-principal-funcionario.component';
import { RegistrarParqueoComponent } from './registrar-parqueo/registrar-parqueo.component';
import { RegistrarVehiculoComponent } from './registrar-vehiculo/registrar-vehiculo.component';

import { ConsultarFuncionarioComponent } from './consultar-funcionario/consultar-funcionario.component';
// import { EditarCorreoComponent } from './editar-correo/editar-correo.component';
import { EstadisticasFHComponent } from './estadisticas-fh/estadisticas-fh.component';
import { ManejoPlanillaComponent } from './manejo-planilla/manejo-planilla.component';
// import { PostCreateComponent } from './posts/post-create/post-create.component';
// import { PostListComponent } from './posts/post-list/post-list.component';
import { RegistrarFuncionarioComponent } from './registrar-funcionario/registrar-funcionario.component';
import { RegistroHorarioComponent } from './registro-horario/registro-horario.component';
import { LogInComponent } from './log-in/log-in.component';
import { VisualizarReservacionesComponent } from './visualizar-reservaciones/visualizar-reservaciones.component';
import { DetalleEstacionamientoComponent } from './detalle-estacionamiento/detalle-estacionamiento.component';
import { EstadisticasPorDepartamentoComponent } from './estadisticas-por-departamento/estadisticas-por-departamento.component';
import { EstadisticaEstacionamientoParticularComponent } from './estadistica-estacionamiento-particular/estadistica-estacionamiento-particular.component';
import { OcupacionPorDepartamentoComponent } from './ocupacion-por-departamento/ocupacion-por-departamento.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  // {path:"post-create", component: PostCreateComponent},
  // {path:"post-list", component:PostListComponent},
  { path:"registrar-funcionario", 
    component:RegistrarFuncionarioComponent, 
    data: {
      usuario: 'admin'
    },
    canActivate: [AuthGuard]
  },
  { path:"menu-principal-admin", 
    component:MenuPrincipalAdminComponent, 
    data: {
      usuario: 'admin'
    },
    canActivate: [AuthGuard]
  },
  { path:"menu-principal-func", 
    component:MenuPrincipalFuncionarioComponent,
    data: {
      usuario: 'func'
    }, 
    canActivate: [AuthGuard]
  },
  { path:"informes", 
    component:DescargaInformesComponent, 
    data: {
      usuario: 'admin'
    }, 
    canActivate: [AuthGuard]
  },
  { path:"registrar-vehiculo", 
    component:RegistrarVehiculoComponent, 
    data: {
      usuario: 'func'
    }, 
    canActivate: [AuthGuard]
  },
  { path:"registrar-parqueo", 
    component:RegistrarParqueoComponent,
    data: {
      usuario: 'admin'
    },  
    canActivate: [AuthGuard]
  },
  { path:"consultar-parqueo", 
    component:ConsultarParqueosComponent, 
    data: {
      usuario: 'func'
    }, 
    canActivate: [AuthGuard]
  },
  { path:"consultar-funcionario", 
    component:ConsultarFuncionarioComponent, 
    data: {
      usuario: 'func'
    }, 
    canActivate: [AuthGuard]
  },
  // { path:"editar-correo-personal", 
  //   component:EditarCorreoComponent,
  //   data: {
  //     usuario: 'func'
  //   }, 
  //   canActivate: [AuthGuard]
  // },
  { path:"manejo-planilla", 
    component:ManejoPlanillaComponent, 
    data: {
      usuario: 'jefatura'
    }, 
    canActivate: [AuthGuard]
  },
  { path:"registro-horario", 
    component:RegistroHorarioComponent,
    data: {
      usuario: 'func'
    },  
    canActivate: [AuthGuard]
  },
  { path:"estadisticasFH", 
    component:EstadisticasFHComponent, 
    data: {
      usuario: 'admin'
    }, 
    canActivate: [AuthGuard]
  },
  { path:"log-in", component:LogInComponent},
  { path:"", redirectTo: '/log-in', pathMatch: 'full'},
  { path: "visualizar-reservaciones", component: VisualizarReservacionesComponent},
  { path: "detalle-estacionamiento", component: DetalleEstacionamientoComponent},
  { path: "estadisticas-por-departamento", component: EstadisticasPorDepartamentoComponent},
  { path: "estadisticas-estacionamiento-particular", component: EstadisticaEstacionamientoParticularComponent},
  { path: "ocupacion-por-departamento", component: OcupacionPorDepartamentoComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
