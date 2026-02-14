import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TablaHoras } from "../components/tablaHoras";
import { FormatearFecha } from "../components/FormatearFecha";

export function PrediccionHoras() {

  //Obtener el id del municipio de la URL
  const [seachParams] = useSearchParams();
  const idMunicipio = seachParams.get("id");

  //useState
  const [prediccionHoras, setPrediccionHoras] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  //Cargar predicción horaria al entrar en la página
  useEffect(() => {
    if(!municipio) return;

    setCargando(true);
    setError("");

    fetch(`http://localhost:3000/api/prediccion-horas/${idMunicipio}`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setPrediccionHoras(data.dias);
        }
        else {
          setError("No se ha podido obtener la predicción por horas");
        }
      })
      .catch(() => setError("Error al conectar con el servidor"))
      .finally(() => setCargando(false));

  }, [idMunicipio]);

  return (
    <div>
      <h1>Predicción por horas</h1>
      {cargando && 
        <p className="mensajes">Cargando</p>}
      {error &&
        <p className="error">{error}</p>}

      {prediccionHoras && prediccionHoras.map((dia, index) => (
        <div key={index} className="contenedor-tabla">
          <h3>Día {FormatearFecha({fecha: dia.fecha})}</h3>
          <TablaHoras listaHoras = {dia.horas}/>
        </div>
      ))}
    </div>
  );
}
