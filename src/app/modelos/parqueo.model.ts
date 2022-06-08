export interface Parqueo {
    _id: string;
    _id_parqueo: string;
    tipo: string;
    capacidad_total: number;
    capacidad_actual: number;
    campus: string;
    espacios_jefatura: number;
    espacios_VOficiales: number;
    espacios_asignados: number;
    espacios_visitantes: number;
    espacios_NEspeciales: number;
    direccion: string;
    contacto: string;
    id_contrato: string;
    horario: Array<any>;
    espacios: Array<any>;
}