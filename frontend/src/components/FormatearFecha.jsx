  /*FUNCIÓN PARA FORMATEAR LA FECHA A DD/MM*/
  export function FormatearFecha({fecha}) {
    if(!fecha) return "";

    const fechaDia = new Date(fecha);

    if(isNaN(fechaDia.getTime())) return "";

    //Obtener el día del mes con formato XX
    const dia = fechaDia.getDate().toString().padStart(2, "0");
    //Obtener el mes con formato XX (los meses empiezan en 0, por eso sumo 1)
    const mes = (fechaDia.getMonth() + 1).toString().padStart(2, "0");
    return `${dia}/${mes}`;
  }