export function IconosDescripcion({ descripcion }) {
    if (!descripcion) return "";

    const texto = descripcion.toLowerCase();

    //Tormenta
    if (texto.includes("tormenta")) return "⛈️";

    //Nieve
    if (texto.includes("nieve")) return "❄️";

    //Lluvia, llovizna o chubascos
    //Pongo "lluvi" para que detecte lluvia, lluvias y lluvioso
    if (texto.includes("lluvi") || texto.includes("chubasco") || texto.includes("llovizna")) return "🌧️";

    //Niebla, bruma o calima
    if (texto.includes("niebla") || texto.includes("bruma") || texto.includes("calima")) return "🌫️";

    //Parcialmente soleado
    if (texto.includes("parcialmente soleado")) return "🌤️";

    //Poco nuboso, intervalos nubosos o nubes altas
    if (texto.includes("poco nuboso") || texto.includes("intervalos nubosos") || texto.includes("nubes altas")) return "⛅";

    //Nuboso, muy nuboso, cubierto
    if (texto.includes("nuboso") || texto.includes("muy nuboso") || texto.includes("cubierto")) return "⛅";

    //Soleado, despejado
    if (texto.includes("despejado") || texto.includes("soleado")) return "☀️";

    //En el caso de que no coincida ninguna descripción, dejar en blanco
    return " ";
}
