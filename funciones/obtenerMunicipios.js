//Para poder usar la API KEY:
require('dotenv').config();

/*Función para obtener los municipios con el maestro de municipios de la AEMET*/
async function obtenerMunicipios() {
  try {
    //Primera petición para obtener el JSON que contiene la URL real
    const response1 = await fetch(`https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=${process.env.AEMET_API_KEY}`);

    if (!response1.ok) {
      throw new Error(`Error HTTP en AEMET: ${response1.status}`);
    }
    //En la respuesta aparece la propiedad datos, que es la que contiene la URL de los municipios
    const datosMunicipios = await response1.json();

    //Segunda petición
    const response2 = await fetch(datosMunicipios.datos);

    if (!response2.ok) {
      throw new Error(`Error al obtener municipios: ${response2.status}`);
    }

    //Devolver el array de municipios
    //Resolver problema con las tildes en el desplegable
    const buffer = await response2.arrayBuffer(); 
    const texto = new TextDecoder("iso-8859-1").decode(buffer); 
    return JSON.parse(texto);
  }
  catch (error) {
    console.error("Error en función obtenerMunicipios: ", error.message);
    throw error;
  }
}

module.exports = obtenerMunicipios;