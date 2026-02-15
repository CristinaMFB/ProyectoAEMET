/*Uso esta función porque la AEMET para algunos datos nos devuelve desde las 07h y en otros datos desde las 08h, por ejemplo.*/
function combinarHoras(dia) {
    const fecha = dia.fecha.split("T")[0];

    //Coger las horas de cada variable
    const horasEstadoCielo = dia.estadoCielo?.map(h => h.periodo) ?? []; 
    const horasTemp = dia.temperatura?.map(h => h.periodo) ?? []; 
    const horasPrec = dia.precipitacion?.map(h => h.periodo) ?? []; 
    const horasViento = dia.vientoAndRachaMax?.map(h => h.periodo) ?? [];

    //Solo las horas que están en todas las variables
    const horasComunes = horasEstadoCielo
        .filter(h => horasTemp.includes(h))
        .filter(h => horasPrec.includes(h))
        .filter(h => horasViento.includes(h));

    //Ordenar las horas
    const horasOrdenadas = horasComunes.sort((a, b) => Number(a) - Number(b));

    //Lista final de las horas
    const horas = horasOrdenadas.map(periodo => ({
        fecha,
        hora: periodo,
        estadoCielo: dia.estadoCielo.find(h => h.periodo === periodo)?.descripcion ?? "", 
        temperatura: dia.temperatura.find(h => h.periodo === periodo)?.value ?? "", 
        precipitacion: dia.precipitacion.find(h => h.periodo === periodo)?.value ?? "", 
        vientoDireccion: dia.vientoAndRachaMax.find(h => h.periodo === periodo)?.direccion?.[0] ?? "", 
        vientoVelocidad: dia.vientoAndRachaMax.find(h => h.periodo === periodo)?.velocidad?.[0] ?? 0 
    }));
    return {fecha, horas};
}

module.exports = combinarHoras;