import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TablaDias } from "../components/TablaDias";

export function PrediccionDias() {
  //Obtener el id del municipio de la URL
  const [searchParams] = useSearchParams();
  const idMunicipio = searchParams.get("id");

  //UseState
  const [prediccionDiaria, setPrediccionDiaria] = useState(null);
  const [prediccionHoras, setPrediccionHoras] = useState(null);


  //UseState para controlar la carga y los errores
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  //La primera vez que se carga la página o cada vez que se cambie el municipio
  useEffect(() => {
    //Si no hay id en la URL no se hace nada
    if(!idMunicipio) return;

    //Primero limpio los errores y pongo true en setCargando para indicar que está cargando
    setCargando(true);
    setError("");

    //Cargar predicción diaria
    fetch(`http://localhost:3000/api/prediccion/${idMunicipio}`)
      .then(res => res.json())
      .then(data => {
        //Si success=true, se guarda el array de días con los datos de las predicciones en el estado "prediccion"
        if(data.success) {
          setPrediccionDiaria(data.dias);
        }
        //Si no, mostrar mensaje de error
        else {
          throw new Error("Error en la predicción diaria");
        }
        ////Cargar predicción horaria (para ver los días que aparecen)
        return fetch(`http://localhost:3000/api/prediccion-horas/${idMunicipio}`);
      })
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setPrediccionHoras(data.dias);
        }
        else {
          setPrediccionHoras([]);
        }
      })
      .catch(() => {
        //Si hay error de red o el servidor n responde
        setError("Error al conectar con el servidor");
      })
      .finally(() => { 
          setCargando(false); 
      });
        
//Se ejecuta cuando cambia idMunicipio
  }, [idMunicipio]);

  return (
    <div className="contenedor-prediccion-dias">
      <h1>Predicción de la semana</h1>

      {cargando && 
        <p className="mensajes">Cargando...</p>}
      {error &&
        <p className="error">{error}</p>}

      {/*TABLA CON LA PREDICCIÓN DIARIA*/}
      {prediccionDiaria && (
        <TablaDias dias={prediccionDiaria} horas={prediccionHoras} idMunicipio={idMunicipio} />
      )}
    </div>
  );
}
