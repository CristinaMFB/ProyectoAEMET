// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
      '/api/cp/:codigoPostal': 'Buscar un municipio por código postal',
      '/api/municipio/nombre/:nombre': 'Busca un municipio por su nombre'
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
    return await response2.json();
  }
  catch (error) {
    console.error("Error en función obtenerMunicipios: ", error.message);
    throw error;
  }
}

/*ENDPOINT para la búsqueda por código postal*/
app.get('/api/cp/:codigoPostal', async (req, res) => {
  try {
    const codigoPostal = req.params.codigoPostal;

    //Obtener los municipios
    const municipios = await obtenerMunicipios();

    //Buscar el municipio cuyo id_old coincida con el código postal
    const municipioEncontrado = municipios.find(m => String(m.id_old) === codigoPostal);

    if (!municipioEncontrado) {
      return res.status(404).json({
        success: false,
        error: 'No existe ningún municipio con ese código postal'
      });
    }

    //Solo necesito el id del municipio y el nombre
    //El id tiene la forma "idXXXXX", pero solo quiero "XXXXX" ya que es lo que usa la API para hacer la búsqueda
    //de la predicción por dias y por horas de cada municipio
    res.json({
      success: true,
      municipio: {
        id: municipioEncontrado.id.replace("id", ""),
        nombre: municipioEncontrado.nombre
      }
    });

  }
  catch (error) {
    console.error('Error al buscar por código postal: ', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al buscar el municipio por código postal',
      detalles: error.message
    });
  }
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
