import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TablaHoras } from "../components/TablaHoras";
import { FormatearFecha } from "../components/FormatearFecha";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function PrediccionHoras() {

  //Obtener el id del municipio de la URL
  const [searchParams] = useSearchParams();
  const idMunicipio = searchParams.get("id");
  const diaSeleccionado = searchParams.get("dia");

  //useState
  const [prediccionHoras, setPrediccionHoras] = useState(null);
  const [horasDia, setHorasDia] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  //Cargar predicción horaria al entrar en la página
  useEffect(() => {
    if (!idMunicipio) return;

    setCargando(true);
    setError("");

    fetch(`http://localhost:3000/api/prediccion-horas/${idMunicipio}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          setError(data.error || "No se ha podido obtener la predicción por horas");
          return;
        }

        setPrediccionHoras(data.dias);
        //Filtrar el día seleccionado
        const diaEncontrado = data.dias.find(d =>
          d.fecha.split("T")[0] === diaSeleccionado.split("T")[0]
        );

        if (!diaEncontrado) {
          setError("No hay predicción horaria para este día");
        }
        else {
          setHorasDia(diaEncontrado.horas);
        }
      })
      .catch((error) => setError(error.message || "Error al conectar con el servidor"))
      .finally(() => setCargando(false));

  }, [idMunicipio, diaSeleccionado]);

  return (
    <>
      <Header />
      <div>
        <h1>Predicción por horas</h1>
        {diaSeleccionado && (
          <h3>Día {FormatearFecha({ fecha: diaSeleccionado })}</h3>
        )}
        {cargando &&
          <p className="mensajes">Cargando</p>}
        {error &&
          <p className="error">{error}</p>}

        {horasDia && (
          <>
            <TablaHoras listaHoras={horasDia} />
            <Link to={`/prediccion-dias?id=${idMunicipio}`} className="boton-volver">Volver</Link>
          </>
        )}
      </div>
      <Footer />
    </>

  );
}
