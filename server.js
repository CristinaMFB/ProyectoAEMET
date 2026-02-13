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

/*EJEMPLOS
// Ruta principal de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API Backend',
    endpoints: {
      '/api/ejemplo': 'Obtiene datos de ejemplo de una API externa',
      '/api/usuarios': 'Obtiene lista de usuarios de ejemplo',
      '/api/usuario/:id': 'Obtiene un usuario específico por ID'
    }
  });
});

// EJEMPLO 1: Endpoint que consulta a una API externa y devuelve los datos
app.get('/api/ejemplo', async (req, res) => {
  try {
    // Hacer petición a API externa (JSONPlaceholder como ejemplo)
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }
    
    // Convertir respuesta a JSON
    const data = await response.json();
    
    // Devolver los datos al cliente
    res.json({
      success: true,
      data: data
    });
    
  } catch (error) {
    console.error('Error al consultar la API:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los datos de la API externa',
      detalles: error.message
    });
  }
});

// EJEMPLO 2: Endpoint que obtiene una lista de recursos
app.get('/api/usuarios', async (req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const usuarios = await response.json();
    
    res.json({
      success: true,
      total: usuarios.length,
      data: usuarios
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios'
    });
  }
});

// EJEMPLO 3: Endpoint con parámetros dinámicos
app.get('/api/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const usuario = await response.json();
    
    res.json({
      success: true,
      data: usuario
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el usuario'
    });
  }
});

// EJEMPLO 4: Endpoint con query parameters (para filtros, búsquedas, etc.)
app.get('/api/posts', async (req, res) => {
  try {
    // Obtener parámetros de consulta (ej: /api/posts?userId=1)
    const { userId } = req.query;
    
    let url = 'https://jsonplaceholder.typicode.com/posts';
    
    // Si se proporciona userId, filtrar por ese usuario
    if (userId) {
      url += `?userId=${userId}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const posts = await response.json();
    
    res.json({
      success: true,
      total: posts.length,
      filtros: { userId: userId || 'ninguno' },
      data: posts
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener posts'
    });
  }
});
*/

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
        estadoCielo: dia.estadoCielo[0]?.descripcion || "" ,        
        tempGeneral,
        temperaturaMax: dia.temperatura.maxima,
        temperaturaMin: dia.temperatura.minima,
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
