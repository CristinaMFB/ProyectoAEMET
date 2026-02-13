function calcularViento(viento) {
    //Si no existe el array o está vacío, se devuelve ""
    if(!viento || viento.length === 0) {
        return {
            direccion: "",
            velocidad: 0
        };
    }

    //Encontrar el tramo 00-24 que corresponde al dia completo
    const vientoGeneral = viento.find(v => v.periodo === "00-24");

    if(vientoGeneral) {
        return {
            direccion: vientoGeneral.direccion ?? "",
            velocidad: vientoGeneral.velocidad ?? 0
        };
    }

    //Si no existe el tramo, uso el primer valor disponible
    const vientoFinal = viento[0];
    
    return {
        direccion: vientoFinal.direccion ?? "",
        velocidad: vientoFinal.velocidad ?? 0
    };
}

module.exports = calcularViento;