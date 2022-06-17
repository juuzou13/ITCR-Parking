export interface Reserva {
    idReserva: string,
    idPersona: string,
    idEspacio: string,
    idParqueo: string,
    placa: string,
    rangoHorario: {
        dia: string,
        dia_mes: number,
        mes: number,
        anio: number,
        hora_entrada: string,
        hora_salida: string,
    },
    nombreVisitante: string,
    nombreJefaturaAdmin: string,
    motivo: string,
    sitio: string,
    modelo: string,
    color: string
}