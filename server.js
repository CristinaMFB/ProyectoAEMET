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
      '/api/prediccion/:idMunicipio': 'Obtiene la predicción diaria de un municipio',
      '/api/prediccion-horas/:idMunicipio': 'Obtiene la predicción por horas de un municipio'
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

//ENDPOINT: Predicción por horas
app.get('/api/prediccion-horas/:idMunicipio', async (req, res) => {
  try {
    const idMunicipio = req.params.idMunicipio;
    
    //Primera petición
    const response1 = await fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${idMunicipio}?api_key=${process.env.AEMET_API_KEY}`);
    
    if(!response1.ok) {
      throw new Error(`Error HTTP en AEMET: ${response1.status}`);
    }
    
    const datos1 = await response1.json();

    //Segunda petición
    const response2 = await fetch(datos1.datos);

    if(!response2.ok) {
      throw new Error(`Error al obtener la predicción por horas: ${response2.status}`);
    }

    const datos2 = await response2.json();

    const prediccion = datos2[0];

    //La AEMET devuelve los datos separados por variable (estadoCielo, temperatura,...) y cada variable tiene un periodo que indica la hora.
    //Necesito unir cada periodo para obtener todas las variables en el mismo periodo.

    //Cada día tiene un bloque de horas
    const dias = prediccion.prediccion.dia;

    const horasFinal = dias.map(dia => {
      //Formateo de la fecha para obtener XXXX-XX-XX. La AEMET devuelve la fecha así: 2026-02-13T20:11:12. Así que hay que dividir por la letra T y quedarnos solo con la parte de la izquierda que es la de la fecha
      const fecha = dia.fecha.split("T")[0];
      const horas = dia.estadoCielo.map(h => {
        const periodo = h.periodo;
        
        return {
          fecha,
          hora: periodo,
          estadoCielo: h.descripcion || "",
          temperatura: dia.temperatura.find(t => t.periodo === periodo)?.value ?? "",
          precipitacion: dia.precipitacion.find(p => periodo === periodo)?.value ?? "",
          vientoDireccion: dia.vientoAndRachaMax.find(v => v.periodo === periodo)?.direccion?.[0] ?? "",
          vientoVelocidad: dia.vientoAndRachaMax.fing(v => v.periodo === periodo)?.velocidad?.[0] ?? 0
        };
      });

      return {fecha, horas};
    });

    res.json({
      success: true,
      municipio: prediccion.nombre,
      idMunicipio,
      dias: horasFinal
    });
  }

  catch (error) {
    console.error("Error al obtener predicción por horas: ", error.message);
    res.status(500).json({
      sucess: false,
      error: "Error al obtener la predicción por horas",
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
