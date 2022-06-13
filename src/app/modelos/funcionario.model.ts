export interface Funcionario {
    id:number,
    identificacion:string,
    nombre_completo:string,
    contrasenna:string,
    celular:string,
    horario: Array<any>,
    correo_institucional:string,
    departamentos: Array<any>,
    tipo_funcionario:string,
    placas_asociadas: Array<any>,
    admin:number,
    jefatura:number,
    correo_personal:string,
    campus_departamento_jefatura:{nombre_campus:string, departamento:string},
    incapacitado:number,
    idParqueoOperador:string
}