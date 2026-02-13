// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Importar archivo provincias.js
const provincias = require('./provincias');

//Importar las funciones
const obtenerMunicipios = require('./funciones/obtenerMunicipios');
const obtenerPrediccionDiaria = require('./funciones/obtenerPrediccionDiaria');
const calcularTemperaturaGeneral = require('./funciones/calcularTemperaturaGeneral');
const calcularProbPrecipitacion = require('./funciones/calcularProbPrecipitacion');
const calcularViento = require('./funciones/calcularViento');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json()); // Parsear JSON en el body de las peticiones

//RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API Backend del proyecto de la AEMET de DWEC',
    endpoints: {
      '/api/municipio/nombre/:nombre': 'Busca un municipio por su nombre',
      '/api/provincia/:codigo/municipios': 'Obtiene los municipios de una provincia',
      '/api/prediccion/:idMunicipio': 'Obtiene la predicción diaria de un municipio'
    }
  });
});

//ENDPOINT: Buscar municipio por nombre
app.get('/api/municipio/nombre/:nombre', async (req, res) => {
  try {
    //Paso el nombre introducido por el usuario a minúsculas
    const nombreIntroducido = req.params.nombre.toLowerCase();

    //Obtengo todos los municipios
    const municipios = await obtenerMunicipios();

    //Buscar el municipio que coincide con lo que ha escrito el usuario, me quedo únicamente con el primero que coincide y ahí se para la búsqueda
    //No debe haber dos municipios con el mismo nombre exacto
    const municipioEncontrado = municipios.find(m => m.nombre.toLowerCase() === nombreIntroducido);

    if(!municipioEncontrado) {
      return res.status(404).json({
        success: false,
        error: 'No existe ningún municipio con ese nombre'
      });
    }

    res.json({
      success: true,
      municipio: {
        id: municipioEncontrado.id.replace("id", ""),
        nombre: municipioEncontrado.nombre
      }
    });
  }
  catch(error) {
    console.error('Error al buscar municipio: ', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al buscar el municipio por nombre',
      detalles: error.message
    });
  }
});


//ENDPOINT: Municipios de una provincia
app.get('/api/provincia/:codigo/municipios', async (req, res) => {
  try {
    const codigoProvincia = req.params.codigo;

    //Tengo que comprobar que el código de provincia existe en mi archivo provincias.js. Si no existe, devuelvo un error
    if(!provincias[codigoProvincia]) {
      return res.status(400).json({
        success: false,
        error: 'Código de provincia no válido'
      });
    }
    //Llamo a la función obtenerMunicipios
    const municipios = await obtenerMunicipios();

    //Filtro los municipios que pertenecen a esa provincia y cojo únicamente el id y el nombre, que es lo que me hace falta para rellenar el desplegable
    const municipiosProvincia = municipios
      .filter(m => {
        const idOld = String(m.id_old);
        return idOld.startsWith(codigoProvincia);
      })
      .map(m => ({
        id: m.id.replace("id", ""),
        nombre: m.nombre
      }));

    //Devuelvo la información
    res.json({
      success: true,
      provincia: provincias[codigoProvincia],
      codigoProvincia,
      total: municipiosProvincia.length,
      municipios: municipiosProvincia
    });
  }
  catch(error) {
    console.error('Error al obtener municipios: ', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los municipios de la provincia',
      detalles: error.message
    });
  }
});


//ENDPOINT: Predicción diaria
app.get('/api/prediccion/:idMunicipio', async (req, res) => {
  try {
    //Guardar el id del municipio
    const idMunicipio = req.params.idMunicipio;

    //Función ObtenerPrediccionDiaria
    const prediccionDiaria = await obtenerPrediccionDiaria(idMunicipio);

    //Nombre del municipio 
    const nombreMunicipio = prediccionDiaria.nombre;

    //Array de los días
    const diasPrediccion = prediccionDiaria.prediccion.dia;


    //Solo devuelvo los datos que voy a necesitar (fecha, estado del cielo (descripcion), probabilidad de precipitacion, temperatura máxima, temperatura mínima y viento
    const prediccionDias = diasPrediccion.map(dia => {
      const temperaturaGeneral = calcularTemperaturaGeneral(dia.temperatura);
      const probabilidadPrecipitacion = calcularProbPrecipitacion(dia.probPrecipitacion);
      const viento = calcularViento(dia.viento);

      return {
        fecha: dia.fecha,
        //En estadoCielo, necesitamos el periodo 00-24 que es el que corresponde al día completo. Hay veces que este dato no está y no puedo hacer una media de una descripción, entonces si en el periodo 00-24 no hay descripción, lo dejo en blanco
        estadoCielo: 
          Array.isArray(dia.estadoCielo) && dia.estadoCielo.length > 0 ? dia.estadoCielo[0].descripcion : "",      
        tempGeneral: temperaturaGeneral,
        temperaturaMax: dia.temperatura.maxima,
        temperaturaMin: dia.temperatura.minima,
        probPrecipitacion: probabilidadPrecipitacion,
        vientoDireccion: viento.direccion,
        vientoVelocidad: viento.velocidad
      };
    });

    res.json({
      success: true,
      municipio: nombreMunicipio,
      idMunicipio,
      dias: prediccionDias
    });
  }
  catch(error) {
    console.error('Error al obtener predicción diaria: ', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener la predicción diaria',
      detalles: error.message
    });
  }
});

// Ruta para manejar endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación disponible en http://localhost:${PORT}`);
});
