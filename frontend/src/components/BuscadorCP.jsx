import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BuscadorCP() {
    //UseState para guardar lo que se escribe en el input
    const [cp, setCp] = useState("");
    //Hook de React Router
    const navigate = useNavigate();

    //Función cuando el usuario pulsa el botón "Aceptar"
    function busqueda() {
        //Si el usuario no escribe nada, mostrar mensaje
        if(!cp) {
            alert("Introduce un código postal");
            return;
        }

        //Al pulsar el botón aceptar, ir a la página de predicción por días enviando el código postal como parámetro
        navigate(`/prediccion-dias?cp=${cp}`);
    }

    return (
        <div>
            <h3>Búsqueda por código postal</h3>
            <input type="text" placeholder="Código postal" value={cp} onChange={(e) => setCp(e.target.value)}/>
            <button onClick={busqueda}>Aceptar</button>
        </div>
    );
}