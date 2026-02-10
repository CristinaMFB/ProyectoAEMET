import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function BuscadorMunicipio() {
    //UseState para guardar lo que se escriba en el input
    const [municipioIntroducido, setMunicipioIntroducido] = useState("");

    //Hook de React Router
    const navigate = useNavigate();

    //Función cuando el usuario pulsa el botón de "Aceptar"
    async function busqueda() {
        //Si no ha escrito nada, mostrar un mensaje
        if(!municipioIntroducido) {
            alert("Introduce un nombre de municipio");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/municipio/nombre/${municipioIntroducido}`);

            const datos = await response.json();

            if(!datos.success) {
                alert(datos.error || "No se ha encontrado el municipio");
                return;
            }

            //Obtener el id del municipio que coincide con el buscado
            const idMunicipio = datos.municipio.id;

            //Ir a la página de predicción por días, enviando como parámetro el idMunicipio
            navigate(`/prediccion-dias?id=${idMunicipio}`);
        }
        catch (error) {
            alert("Error al conectar con el servidor");
        }
    }

    return (
        <div>
            <h3>Búsqueda manual por municipio</h3>
            <input type="text" placeholder="Introduzca un municipio" value={municipioIntroducido} onChange={(e) => setMunicipioIntroducido(e.target.value)}/>
            <button onClick={busqueda}>Aceptar</button>
        </div>
    );
}