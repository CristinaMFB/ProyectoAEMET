/*La AEMET nos da los datos de las temperaturas diarias de la siguiente manera:
- Temperatura máxima
- Temperatura mínima
- Temperatura dividida en franjas horarias (solo los primeros días)
Entonces, como quiero que en la predicción diaria aparezca una temperatura general del día en la medida de lo posible,
en los primeros días esta función hará la media entre las franjas horarias para calcular la temperatura general.
En los días en los que no haya temperatura general, se dejará vacía.*/

function calcularTemperaturaGeneral(temperatura) {
    if (!temperatura?.dato || temperatura.dato.length === 0) {
        return "";
    }

    const valoresTemperatura = temperatura.dato.map(t => t.value);
    const suma = valoresTemperatura.reduce((a, b) => a + b, 0);
    const media = Math.round(suma/valoresTemperatura.length);
    return media;
}
module.exports = calcularTemperaturaGeneral;