import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TablaDias } from "../components/TablaDias";

export function PrediccionDias() {
  //Uso useSearchParams para leer los arámetros que tiene la URL para obtener el valor del id
  const [searchParams] = useSearchParams();
  const idMunicipio = searchParams.get("id");

  //UseState para guardar el array de predicción diaria
  const [prediccionDiaria, setPrediccionDiaria] = useState(null);

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

    fetch(`http://localhost:3000/api/prediccion/${idMunicipio}`)
      .then((res) => res.json())
      .then((data) => {
        //Si success=true, se guarda el array de días con los datos de las predicciones en el estado "prediccion"
        if(data.success) {
          setPrediccionDiaria(data.dias);
        }
        //Si no, mostrar mensaje de error
        else {
          setError("No se ha podido obtener la predicción meteorológica");
        }
      })

      .catch(() => {
        //Si hay error de red o el servidor n responde
        setError("Error al conectar con el servidor");
      })

      //Ya se quita el cargando
      .finally(() => { 
        setCargando(false); 
      });

//Se ejecuta cuando cambia idMunicipio
  }, [idMunicipio]);

  return (
    <div>
      <h1>Predicción de la semana</h1>

      {cargando && 
        <p className="mensajes">Cargando...</p>}
      {error &&
        <p className="error">{error}</p>}

      {/*TABLA CON LA PREDICCIÓN DIARIA*/}
      {prediccionDiaria && (
        <TablaDias dias={prediccionDiaria} />
      )}
    </div>
  );
}
