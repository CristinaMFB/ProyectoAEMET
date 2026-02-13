function calcularProbPrecipitacion(probPrecipitacion) {
    //Si no existe o está vacio, lo devolvemos en blanco
    if(!probPrecipitacion || probPrecipitacion.length === 0) {
        return 0;
    }

    //Intento encontrar el tramo 00-24 que corresponde al día completo
    const precipitacionGeneral = probPrecipitacion.find(p => p.periodo === "00-24");

    if(precipitacionGeneral) {
        return precipitacionGeneral.value;
    }

    //Si no existe ese periodo, usar el primer valor disponible. En algunos días (los últimos), la probabilidad de precipitación no aparece por franjas
    return probPrecipitacion[0].value || 0;
}

module.exports = calcularProbPrecipitacion;