require('dotenv').config();

//Función para obtener la predicción diaria en un municipio
async function obtenerPrediccionDiaria(idMunicipio) {
    try {
        //Primera petición a la AEMET
        const response1 = await fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${idMunicipio}?api_key=${process.env.AEMET_API_KEY}`);
        
        if(!response1.ok) {
            throw new Error(`Error HTTP en AEMET: ${response.status}`);
        }
        //JSON con los datos de la primera petición
        const datos1 = await response1.json();

        //Segunda petición para descargar los datos reales desde la URL de devuelve la AEMET
        const response2 = await fetch(datos1.datos);

        if(!response2.ok) {
            throw new Error(`Error al obtener la predicción diaria: ${response2.status}`);
        }

        //Array que devuelve
        const datos2 = await response2.json();

        //Extraer los datos, la AEMET da los datos en un array de un único elemento
        const prediccionDiaria = datos2[0];

        return prediccionDiaria;
    }
    catch (error) {
        console.error("Error en función obtenerPrediccionDiaria: ", error.message);
        throw error;
    }
}

module.exports = obtenerPrediccionDiaria;